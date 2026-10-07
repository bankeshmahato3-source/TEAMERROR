import { Request, Response } from 'express';
import { dbStore } from '../models/store';
import { AuthenticatedRequest } from '../middleware/auth';
import { FraudDetectionEngine } from '../services/fraudEngine';
import { FraudSimulationService } from '../services/simulationService';
import { logSecurityEvent } from '../utils/auditLogger';

export const analyzeAdHoc = async (req: Request, res: Response) => {
  try {
    const { amount, merchantId = 'merch_01', customerEmail, clientIp, device, location, upiId, paymentUrl } = req.body;

    if (!amount || !customerEmail) {
      return res.status(400).json({ success: false, message: 'Amount and customer email are required' });
    }

    const result = FraudDetectionEngine.analyze({
      amount: Number(amount),
      merchantId,
      customerEmail,
      clientIp,
      device,
      location,
      upiId,
      paymentUrl,
    });

    return res.json({ success: true, analysis: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Analysis failed' });
  }
};

export const getFraudAlerts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, severity } = req.query;

    let alerts = dbStore.fraudAlerts;

    if (status) {
      alerts = alerts.filter((a) => a.status === String(status));
    }

    if (severity) {
      alerts = alerts.filter((a) => a.severity === String(severity));
    }

    return res.json({ success: true, count: alerts.length, alerts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
  }
};

export const updateAlertStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED'

    const alert = dbStore.fraudAlerts.find((a) => a.id === id || a.alertId === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: `Alert ${id} not found` });
    }

    alert.status = status;
    dbStore.saveToDisk();

    logSecurityEvent(
      'ALERT_STATUS_UPDATED',
      req.user?.email || 'analyst@payguard.io',
      req.user?.role || 'SECURITY_ANALYST',
      `Alert ${alert.alertId} status marked as ${status}`
    );

    return res.json({ success: true, message: 'Alert updated successfully', alert });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update alert' });
  }
};

export const getFraudInvestigation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = dbStore.payments.find((p) => p.paymentId === paymentId || p.id === paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: `Payment ${paymentId} not found` });
    }

    const fraudAnalysis = dbStore.fraudAnalyses.find((fa) => fa.paymentId === payment.paymentId);
    const relatedAlerts = dbStore.fraudAlerts.filter((a) => a.paymentId === payment.paymentId);
    const order = dbStore.orders.find((o) => o.orderId === payment.orderId);
    const merchant = dbStore.merchants.find((m) => m.id === payment.merchantId);

    // Get customer transaction history for context
    const customerHistory = dbStore.payments
      .filter((p) => p.customerEmail.toLowerCase() === payment.customerEmail.toLowerCase() && p.paymentId !== payment.paymentId)
      .slice(0, 5);

    return res.json({
      success: true,
      investigation: {
        payment,
        fraudAnalysis,
        relatedAlerts,
        order,
        merchant,
        customerHistory,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to load investigation data' });
  }
};

export const runSimulation = async (req: Request, res: Response) => {
  try {
    const simulationResult = await FraudSimulationService.runSimulation();

    logSecurityEvent(
      'FRAUD_SIMULATION_RUN',
      'system@payguard.io',
      'SECURITY_ANALYST',
      `Simulated ${simulationResult.simulatedScenarios.length} transactions across multi-vector threats`
    );

    return res.json({
      success: true,
      message: 'Fraud simulation executed successfully. New transactions and alerts recorded.',
      scenarios: simulationResult.simulatedScenarios,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Simulation execution failed' });
  }
};
