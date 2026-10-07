"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSimulation = exports.getFraudInvestigation = exports.updateAlertStatus = exports.getFraudAlerts = exports.analyzeAdHoc = void 0;
const store_1 = require("../models/store");
const fraudEngine_1 = require("../services/fraudEngine");
const simulationService_1 = require("../services/simulationService");
const auditLogger_1 = require("../utils/auditLogger");
const analyzeAdHoc = async (req, res) => {
    try {
        const { amount, merchantId = 'merch_01', customerEmail, clientIp, device, location, upiId, paymentUrl } = req.body;
        if (!amount || !customerEmail) {
            return res.status(400).json({ success: false, message: 'Amount and customer email are required' });
        }
        const result = fraudEngine_1.FraudDetectionEngine.analyze({
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Analysis failed' });
    }
};
exports.analyzeAdHoc = analyzeAdHoc;
const getFraudAlerts = async (req, res) => {
    try {
        const { status, severity } = req.query;
        let alerts = store_1.dbStore.fraudAlerts;
        if (status) {
            alerts = alerts.filter((a) => a.status === String(status));
        }
        if (severity) {
            alerts = alerts.filter((a) => a.severity === String(severity));
        }
        return res.json({ success: true, count: alerts.length, alerts });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
    }
};
exports.getFraudAlerts = getFraudAlerts;
const updateAlertStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED'
        const alert = store_1.dbStore.fraudAlerts.find((a) => a.id === id || a.alertId === id);
        if (!alert) {
            return res.status(404).json({ success: false, message: `Alert ${id} not found` });
        }
        alert.status = status;
        store_1.dbStore.saveToDisk();
        (0, auditLogger_1.logSecurityEvent)('ALERT_STATUS_UPDATED', req.user?.email || 'analyst@payguard.io', req.user?.role || 'SECURITY_ANALYST', `Alert ${alert.alertId} status marked as ${status}`);
        return res.json({ success: true, message: 'Alert updated successfully', alert });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update alert' });
    }
};
exports.updateAlertStatus = updateAlertStatus;
const getFraudInvestigation = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = store_1.dbStore.payments.find((p) => p.paymentId === paymentId || p.id === paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: `Payment ${paymentId} not found` });
        }
        const fraudAnalysis = store_1.dbStore.fraudAnalyses.find((fa) => fa.paymentId === payment.paymentId);
        const relatedAlerts = store_1.dbStore.fraudAlerts.filter((a) => a.paymentId === payment.paymentId);
        const order = store_1.dbStore.orders.find((o) => o.orderId === payment.orderId);
        const merchant = store_1.dbStore.merchants.find((m) => m.id === payment.merchantId);
        // Get customer transaction history for context
        const customerHistory = store_1.dbStore.payments
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to load investigation data' });
    }
};
exports.getFraudInvestigation = getFraudInvestigation;
const runSimulation = async (req, res) => {
    try {
        const simulationResult = await simulationService_1.FraudSimulationService.runSimulation();
        (0, auditLogger_1.logSecurityEvent)('FRAUD_SIMULATION_RUN', 'system@payguard.io', 'SECURITY_ANALYST', `Simulated ${simulationResult.simulatedScenarios.length} transactions across multi-vector threats`);
        return res.json({
            success: true,
            message: 'Fraud simulation executed successfully. New transactions and alerts recorded.',
            scenarios: simulationResult.simulatedScenarios,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Simulation execution failed' });
    }
};
exports.runSimulation = runSimulation;
