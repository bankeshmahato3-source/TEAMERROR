import { Request, Response } from 'express';
import { dbStore } from '../models/store';
import { AuthenticatedRequest } from '../middleware/auth';
import { FraudDetectionEngine } from '../services/fraudEngine';
import { logSecurityEvent } from '../utils/auditLogger';
import { IPayment, IFraudAnalysis, IFraudAlert, IRefund, PaymentStatus } from '../types';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      method = 'UPI',
      upiId,
      cardLast4,
      walletProvider,
      bankName,
      clientIp = '127.0.0.1',
      device = 'Windows 11 (Chrome)',
      browser = 'Chrome 122.0',
      location = 'Mumbai, India',
      paymentUrl,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = dbStore.orders.find((o) => o.orderId === orderId || o.id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: `Order ${orderId} not found` });
    }

    const merchant = dbStore.merchants.find((m) => m.id === order.merchantId);
    const merchantName = merchant?.name || order.merchantName || 'Sandbox Merchant';

    // Execute Fraud Detection Engine Analysis
    const analysisResult = FraudDetectionEngine.analyze({
      amount: order.amount,
      merchantId: order.merchantId,
      customerEmail: order.customerEmail,
      clientIp,
      device,
      location,
      upiId,
      paymentUrl,
    });

    let status: PaymentStatus = 'SUCCESS';

    // Handle special simulated UPI handles
    if (upiId === 'failed@payguard') {
      status = 'FAILED';
    } else if (upiId === 'pending@payguard') {
      status = 'PENDING';
    } else if (analysisResult.recommendation === 'BLOCK') {
      status = 'BLOCKED';
    } else if (analysisResult.recommendation === 'REVIEW') {
      status = 'REVIEW';
    } else {
      status = 'SUCCESS';
    }

    const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
    const paymentId = `pay_PF${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const payment: IPayment = {
      id: `pay_${Date.now()}`,
      paymentId,
      orderId: order.orderId,
      merchantId: order.merchantId,
      merchantName,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      amount: order.amount,
      currency: order.currency || 'INR',
      method,
      upiId,
      cardLast4: cardLast4 || (method === 'Card' ? '4111' : undefined),
      walletProvider,
      bankName,
      status,
      riskScore: analysisResult.riskScore,
      riskLevel: analysisResult.riskLevel,
      recommendation: analysisResult.recommendation,
      reasons: analysisResult.reasons,
      clientIp,
      device,
      browser,
      location,
      createdAt: timestamp,
    };

    const fraudAnalysis: IFraudAnalysis = {
      id: `fa_${Date.now()}`,
      paymentId,
      riskScore: analysisResult.riskScore,
      riskLevel: analysisResult.riskLevel,
      recommendation: analysisResult.recommendation,
      reasons: analysisResult.reasons,
      triggeredRules: analysisResult.triggeredRules,
      features: analysisResult.features,
      timeline: [
        {
          stage: 'Order Initialization',
          timestamp: new Date(Date.now() - 2500).toISOString(),
          status: 'COMPLETED',
          detail: `Checkout initiated for order ${order.orderId} (₹${order.amount.toLocaleString()})`,
        },
        {
          stage: 'Checkout Telemetry Capture',
          timestamp: new Date(Date.now() - 1500).toISOString(),
          status: 'COMPLETED',
          detail: `Device: ${device} | IP: ${clientIp} (${location})`,
        },
        {
          stage: 'Intelligent Risk Scoring',
          timestamp: new Date(Date.now() - 500).toISOString(),
          status: 'COMPLETED',
          detail: `Assigned score: ${analysisResult.riskScore}/100 [${analysisResult.riskLevel}]. ${analysisResult.triggeredRules.length} rules triggered.`,
        },
        {
          stage: 'Execution Gate',
          timestamp,
          status: status === 'BLOCKED' ? 'BLOCKED' : status === 'REVIEW' ? 'FLAGGED_REVIEW' : 'AUTHORIZED',
          detail: `Final Gate Decision: ${status}. Recommendation: ${analysisResult.recommendation}.`,
        },
      ],
      createdAt: timestamp,
    };

    // Save payment & analysis
    dbStore.payments = [payment, ...dbStore.payments];
    dbStore.fraudAnalyses = [fraudAnalysis, ...dbStore.fraudAnalyses];

    // Update order status
    order.status = status === 'SUCCESS' ? 'paid' : status === 'BLOCKED' ? 'failed' : 'created';
    dbStore.saveToDisk();

    // Trigger Fraud Alert if High/Critical
    if (analysisResult.riskLevel === 'HIGH' || analysisResult.riskLevel === 'CRITICAL') {
      const alert: IFraudAlert = {
        id: `alert_${Date.now()}`,
        alertId: `alt_${Math.floor(1000 + Math.random() * 9000)}`,
        paymentId,
        merchantId: order.merchantId,
        merchantName,
        amount: order.amount,
        riskScore: analysisResult.riskScore,
        severity: analysisResult.riskLevel,
        status: 'OPEN',
        message: `High risk transaction flagged (${analysisResult.riskScore}/100): ${analysisResult.reasons[0]}`,
        createdAt: timestamp,
      };
      dbStore.fraudAlerts = [alert, ...dbStore.fraudAlerts];

      // Dispatch Webhook Event
      dbStore.webhookEvents = [
        {
          id: `whe_${Date.now()}`,
          eventId: `evt_${Math.random().toString(36).substring(2, 9)}`,
          merchantId: order.merchantId,
          eventType: 'fraud.detected',
          payload: { alert, paymentId, riskScore: analysisResult.riskScore },
          deliveryStatus: 'DELIVERED',
          attempts: 1,
          responseCode: 200,
          createdAt: timestamp,
        },
        ...dbStore.webhookEvents,
      ];
    }

    // Webhook for payment
    dbStore.webhookEvents = [
      {
        id: `whe_${Date.now() + 1}`,
        eventId: `evt_${Math.random().toString(36).substring(2, 9)}`,
        merchantId: order.merchantId,
        eventType: status === 'SUCCESS' ? 'payment.success' : status === 'BLOCKED' ? 'payment.blocked' : 'payment.failed',
        payload: { paymentId, orderId: order.orderId, amount: order.amount, status },
        deliveryStatus: 'DELIVERED',
        attempts: 1,
        responseCode: 200,
        createdAt: timestamp,
      },
      ...dbStore.webhookEvents,
    ];

    logSecurityEvent(
      status === 'BLOCKED' ? 'PAYMENT_BLOCKED_FRAUD' : 'PAYMENT_PROCESSED',
      order.customerEmail,
      'CUSTOMER',
      `Payment ${paymentId} (${status}) for ₹${order.amount}. Score: ${analysisResult.riskScore}/100`,
      clientIp
    );

    return res.status(200).json({
      success: true,
      payment,
      fraudAnalysis,
      message:
        status === 'BLOCKED'
          ? 'Transaction blocked by PayGuard Fraud Engine due to critical security risk.'
          : status === 'REVIEW'
          ? 'Transaction flagged for manual security review.'
          : 'Payment simulated successfully in Sandbox Mode.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Payment processing failed' });
  }
};

export const getPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search, merchantId, limit = 50, page = 1 } = req.query;

    let payments = dbStore.payments;

    // Filter by role if merchant
    if (req.user?.role === 'MERCHANT' && req.user.merchantId) {
      payments = payments.filter((p) => p.merchantId === req.user?.merchantId);
    } else if (merchantId) {
      payments = payments.filter((p) => p.merchantId === String(merchantId));
    }

    // Status filter
    if (status && status !== 'All') {
      const s = String(status).toUpperCase();
      payments = payments.filter((p) => p.status === s);
    }

    // Search filter
    if (search) {
      const q = String(search).toLowerCase();
      payments = payments.filter(
        (p) =>
          p.paymentId.toLowerCase().includes(q) ||
          p.orderId.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.customerEmail.toLowerCase().includes(q) ||
          p.merchantName.toLowerCase().includes(q)
      );
    }

    const total = payments.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = payments.slice(startIndex, startIndex + Number(limit));

    return res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      payments: paginated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

export const getPaymentById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payment = dbStore.payments.find((p) => p.paymentId === id || p.id === id);

    if (!payment) {
      return res.status(404).json({ success: false, message: `Payment ${id} not found` });
    }

    const fraudAnalysis = dbStore.fraudAnalyses.find((fa) => fa.paymentId === payment.paymentId);
    const order = dbStore.orders.find((o) => o.orderId === payment.orderId);
    const refund = dbStore.refunds.find((r) => r.paymentId === payment.paymentId);

    return res.json({
      success: true,
      payment,
      fraudAnalysis,
      order,
      refund,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payment details' });
  }
};

export const refundPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, reason = 'Customer requested return' } = req.body;

    const payment = dbStore.payments.find((p) => p.paymentId === id || p.id === id);
    if (!payment) {
      return res.status(404).json({ success: false, message: `Payment ${id} not found` });
    }

    if (payment.status !== 'SUCCESS') {
      return res.status(400).json({ success: false, message: 'Only successful payments can be refunded' });
    }

    const refundAmount = amount ? Number(amount) : payment.amount;
    if (refundAmount > payment.amount) {
      return res.status(400).json({ success: false, message: 'Refund amount cannot exceed payment amount' });
    }

    const isFull = refundAmount === payment.amount;
    const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
    const refundId = `ref_PF${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const newRefund: IRefund = {
      id: `ref_${Date.now()}`,
      refundId,
      paymentId: payment.paymentId,
      orderId: payment.orderId,
      merchantId: payment.merchantId,
      amount: refundAmount,
      currency: payment.currency,
      reason,
      type: isFull ? 'FULL' : 'PARTIAL',
      status: 'PROCESSED',
      createdAt: timestamp,
    };

    payment.status = isFull ? 'REFUNDED' : 'SUCCESS';
    payment.refundedAmount = (payment.refundedAmount || 0) + refundAmount;

    // Update order
    const order = dbStore.orders.find((o) => o.orderId === payment.orderId);
    if (order && isFull) {
      order.status = 'refunded';
    }

    dbStore.refunds = [newRefund, ...dbStore.refunds];

    // Dispatch Webhook
    dbStore.webhookEvents = [
      {
        id: `whe_${Date.now()}`,
        eventId: `evt_${Math.random().toString(36).substring(2, 9)}`,
        merchantId: payment.merchantId,
        eventType: 'payment.refunded',
        payload: { refundId, paymentId: payment.paymentId, amount: refundAmount, type: isFull ? 'FULL' : 'PARTIAL' },
        deliveryStatus: 'DELIVERED',
        attempts: 1,
        responseCode: 200,
        createdAt: timestamp,
      },
      ...dbStore.webhookEvents,
    ];

    logSecurityEvent(
      'PAYMENT_REFUNDED',
      req.user?.email || 'system@payguard.io',
      req.user?.role || 'MERCHANT',
      `Refund ${refundId} of ₹${refundAmount} processed for payment ${payment.paymentId}`
    );

    dbStore.saveToDisk();

    return res.json({
      success: true,
      message: `Refund of ₹${refundAmount.toLocaleString()} processed successfully in sandbox`,
      refund: newRefund,
      payment,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Refund processing failed' });
  }
};
