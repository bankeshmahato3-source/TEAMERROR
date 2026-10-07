"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.getPaymentById = exports.getPayments = exports.processPayment = void 0;
const store_1 = require("../models/store");
const fraudEngine_1 = require("../services/fraudEngine");
const auditLogger_1 = require("../utils/auditLogger");
const processPayment = async (req, res) => {
    try {
        const { orderId, method = 'UPI', upiId, cardLast4, walletProvider, bankName, clientIp = '127.0.0.1', device = 'Windows 11 (Chrome)', browser = 'Chrome 122.0', location = 'Mumbai, India', paymentUrl, } = req.body;
        if (!orderId) {
            return res.status(400).json({ success: false, message: 'orderId is required' });
        }
        const order = store_1.dbStore.orders.find((o) => o.orderId === orderId || o.id === orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: `Order ${orderId} not found` });
        }
        const merchant = store_1.dbStore.merchants.find((m) => m.id === order.merchantId);
        const merchantName = merchant?.name || order.merchantName || 'Sandbox Merchant';
        // Execute Fraud Detection Engine Analysis
        const analysisResult = fraudEngine_1.FraudDetectionEngine.analyze({
            amount: order.amount,
            merchantId: order.merchantId,
            customerEmail: order.customerEmail,
            clientIp,
            device,
            location,
            upiId,
            paymentUrl,
        });
        let status = 'SUCCESS';
        // Handle special simulated UPI handles
        if (upiId === 'failed@payguard') {
            status = 'FAILED';
        }
        else if (upiId === 'pending@payguard') {
            status = 'PENDING';
        }
        else if (analysisResult.recommendation === 'BLOCK') {
            status = 'BLOCKED';
        }
        else if (analysisResult.recommendation === 'REVIEW') {
            status = 'REVIEW';
        }
        else {
            status = 'SUCCESS';
        }
        const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
        const paymentId = `pay_PF${randomSuffix}`;
        const timestamp = new Date().toISOString();
        const payment = {
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
        const fraudAnalysis = {
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
        store_1.dbStore.payments = [payment, ...store_1.dbStore.payments];
        store_1.dbStore.fraudAnalyses = [fraudAnalysis, ...store_1.dbStore.fraudAnalyses];
        // Update order status
        order.status = status === 'SUCCESS' ? 'paid' : status === 'BLOCKED' ? 'failed' : 'created';
        store_1.dbStore.saveToDisk();
        // Trigger Fraud Alert if High/Critical
        if (analysisResult.riskLevel === 'HIGH' || analysisResult.riskLevel === 'CRITICAL') {
            const alert = {
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
            store_1.dbStore.fraudAlerts = [alert, ...store_1.dbStore.fraudAlerts];
            // Dispatch Webhook Event
            store_1.dbStore.webhookEvents = [
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
                ...store_1.dbStore.webhookEvents,
            ];
        }
        // Webhook for payment
        store_1.dbStore.webhookEvents = [
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
            ...store_1.dbStore.webhookEvents,
        ];
        (0, auditLogger_1.logSecurityEvent)(status === 'BLOCKED' ? 'PAYMENT_BLOCKED_FRAUD' : 'PAYMENT_PROCESSED', order.customerEmail, 'CUSTOMER', `Payment ${paymentId} (${status}) for ₹${order.amount}. Score: ${analysisResult.riskScore}/100`, clientIp);
        return res.status(200).json({
            success: true,
            payment,
            fraudAnalysis,
            message: status === 'BLOCKED'
                ? 'Transaction blocked by PayGuard Fraud Engine due to critical security risk.'
                : status === 'REVIEW'
                    ? 'Transaction flagged for manual security review.'
                    : 'Payment simulated successfully in Sandbox Mode.',
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Payment processing failed' });
    }
};
exports.processPayment = processPayment;
const getPayments = async (req, res) => {
    try {
        const { status, search, merchantId, limit = 50, page = 1 } = req.query;
        let payments = store_1.dbStore.payments;
        // Filter by role if merchant
        if (req.user?.role === 'MERCHANT' && req.user.merchantId) {
            payments = payments.filter((p) => p.merchantId === req.user?.merchantId);
        }
        else if (merchantId) {
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
            payments = payments.filter((p) => p.paymentId.toLowerCase().includes(q) ||
                p.orderId.toLowerCase().includes(q) ||
                p.customerName.toLowerCase().includes(q) ||
                p.customerEmail.toLowerCase().includes(q) ||
                p.merchantName.toLowerCase().includes(q));
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch payments' });
    }
};
exports.getPayments = getPayments;
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = store_1.dbStore.payments.find((p) => p.paymentId === id || p.id === id);
        if (!payment) {
            return res.status(404).json({ success: false, message: `Payment ${id} not found` });
        }
        const fraudAnalysis = store_1.dbStore.fraudAnalyses.find((fa) => fa.paymentId === payment.paymentId);
        const order = store_1.dbStore.orders.find((o) => o.orderId === payment.orderId);
        const refund = store_1.dbStore.refunds.find((r) => r.paymentId === payment.paymentId);
        return res.json({
            success: true,
            payment,
            fraudAnalysis,
            order,
            refund,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch payment details' });
    }
};
exports.getPaymentById = getPaymentById;
const refundPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, reason = 'Customer requested return' } = req.body;
        const payment = store_1.dbStore.payments.find((p) => p.paymentId === id || p.id === id);
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
        const newRefund = {
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
        const order = store_1.dbStore.orders.find((o) => o.orderId === payment.orderId);
        if (order && isFull) {
            order.status = 'refunded';
        }
        store_1.dbStore.refunds = [newRefund, ...store_1.dbStore.refunds];
        // Dispatch Webhook
        store_1.dbStore.webhookEvents = [
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
            ...store_1.dbStore.webhookEvents,
        ];
        (0, auditLogger_1.logSecurityEvent)('PAYMENT_REFUNDED', req.user?.email || 'system@payguard.io', req.user?.role || 'MERCHANT', `Refund ${refundId} of ₹${refundAmount} processed for payment ${payment.paymentId}`);
        store_1.dbStore.saveToDisk();
        return res.json({
            success: true,
            message: `Refund of ₹${refundAmount.toLocaleString()} processed successfully in sandbox`,
            refund: newRefund,
            payment,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Refund processing failed' });
    }
};
exports.refundPayment = refundPayment;
