"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityLogs = exports.updateThresholds = exports.updateFraudRule = exports.getFraudRules = exports.toggleMerchantStatus = exports.getAdminMerchants = exports.getAdminUsers = void 0;
const store_1 = require("../models/store");
const auditLogger_1 = require("../utils/auditLogger");
const getAdminUsers = async (req, res) => {
    try {
        const users = store_1.dbStore.users.map(({ passwordHash, ...rest }) => rest);
        return res.json({ success: true, count: users.length, users });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};
exports.getAdminUsers = getAdminUsers;
const getAdminMerchants = async (req, res) => {
    try {
        return res.json({ success: true, count: store_1.dbStore.merchants.length, merchants: store_1.dbStore.merchants });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch merchants' });
    }
};
exports.getAdminMerchants = getAdminMerchants;
const toggleMerchantStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'ACTIVE' | 'SUSPENDED'
        const merchant = store_1.dbStore.merchants.find((m) => m.id === id);
        if (!merchant) {
            return res.status(404).json({ success: false, message: 'Merchant not found' });
        }
        merchant.status = status;
        store_1.dbStore.saveToDisk();
        (0, auditLogger_1.logSecurityEvent)('MERCHANT_STATUS_CHANGED', req.user?.email || 'admin@payguard.io', 'ADMIN', `Merchant ${merchant.name} (${merchant.id}) status set to ${status}`);
        return res.json({
            success: true,
            message: `Merchant status changed to ${status}`,
            merchant,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update merchant' });
    }
};
exports.toggleMerchantStatus = toggleMerchantStatus;
const getFraudRules = async (req, res) => {
    try {
        return res.json({
            success: true,
            rules: store_1.dbStore.fraudRules,
            thresholds: store_1.dbStore.thresholds,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch fraud rules' });
    }
};
exports.getFraudRules = getFraudRules;
const updateFraudRule = async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled, weight } = req.body;
        const rule = store_1.dbStore.fraudRules.find((r) => r.id === id || r.ruleId === id);
        if (!rule) {
            return res.status(404).json({ success: false, message: 'Rule not found' });
        }
        if (enabled !== undefined)
            rule.enabled = Boolean(enabled);
        if (weight !== undefined)
            rule.weight = Number(weight);
        store_1.dbStore.saveToDisk();
        (0, auditLogger_1.logSecurityEvent)('FRAUD_RULE_MODIFIED', req.user?.email || 'admin@payguard.io', 'ADMIN', `Fraud Rule "${rule.name}" updated: enabled=${rule.enabled}, weight=${rule.weight}`);
        return res.json({
            success: true,
            message: `Fraud rule "${rule.name}" updated`,
            rule,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update fraud rule' });
    }
};
exports.updateFraudRule = updateFraudRule;
const updateThresholds = async (req, res) => {
    try {
        const { low, medium, high, critical } = req.body;
        store_1.dbStore.thresholds = {
            low: low !== undefined ? Number(low) : store_1.dbStore.thresholds.low,
            medium: medium !== undefined ? Number(medium) : store_1.dbStore.thresholds.medium,
            high: high !== undefined ? Number(high) : store_1.dbStore.thresholds.high,
            critical: critical !== undefined ? Number(critical) : store_1.dbStore.thresholds.critical,
        };
        (0, auditLogger_1.logSecurityEvent)('RISK_THRESHOLDS_UPDATED', req.user?.email || 'admin@payguard.io', 'ADMIN', `Risk thresholds updated: Low=${store_1.dbStore.thresholds.low}, Med=${store_1.dbStore.thresholds.medium}, High=${store_1.dbStore.thresholds.high}, Crit=${store_1.dbStore.thresholds.critical}`);
        return res.json({
            success: true,
            message: 'Risk scoring thresholds updated successfully',
            thresholds: store_1.dbStore.thresholds,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update thresholds' });
    }
};
exports.updateThresholds = updateThresholds;
const getSecurityLogs = async (req, res) => {
    try {
        const logs = store_1.dbStore.securityLogs.slice(0, 100);
        return res.json({ success: true, count: logs.length, logs });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch logs' });
    }
};
exports.getSecurityLogs = getSecurityLogs;
