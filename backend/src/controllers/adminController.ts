import { Response } from 'express';
import { dbStore } from '../models/store';
import { AuthenticatedRequest } from '../middleware/auth';
import { logSecurityEvent } from '../utils/auditLogger';

export const getAdminUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = dbStore.users.map(({ passwordHash, ...rest }) => rest);
    return res.json({ success: true, count: users.length, users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getAdminMerchants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json({ success: true, count: dbStore.merchants.length, merchants: dbStore.merchants });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch merchants' });
  }
};

export const toggleMerchantStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACTIVE' | 'SUSPENDED'

    const merchant = dbStore.merchants.find((m) => m.id === id);
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    merchant.status = status;
    dbStore.saveToDisk();

    logSecurityEvent(
      'MERCHANT_STATUS_CHANGED',
      req.user?.email || 'admin@payguard.io',
      'ADMIN',
      `Merchant ${merchant.name} (${merchant.id}) status set to ${status}`
    );

    return res.json({
      success: true,
      message: `Merchant status changed to ${status}`,
      merchant,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update merchant' });
  }
};

export const getFraudRules = async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json({
      success: true,
      rules: dbStore.fraudRules,
      thresholds: dbStore.thresholds,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch fraud rules' });
  }
};

export const updateFraudRule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { enabled, weight } = req.body;

    const rule = dbStore.fraudRules.find((r) => r.id === id || r.ruleId === id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }

    if (enabled !== undefined) rule.enabled = Boolean(enabled);
    if (weight !== undefined) rule.weight = Number(weight);

    dbStore.saveToDisk();

    logSecurityEvent(
      'FRAUD_RULE_MODIFIED',
      req.user?.email || 'admin@payguard.io',
      'ADMIN',
      `Fraud Rule "${rule.name}" updated: enabled=${rule.enabled}, weight=${rule.weight}`
    );

    return res.json({
      success: true,
      message: `Fraud rule "${rule.name}" updated`,
      rule,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update fraud rule' });
  }
};

export const updateThresholds = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { low, medium, high, critical } = req.body;

    dbStore.thresholds = {
      low: low !== undefined ? Number(low) : dbStore.thresholds.low,
      medium: medium !== undefined ? Number(medium) : dbStore.thresholds.medium,
      high: high !== undefined ? Number(high) : dbStore.thresholds.high,
      critical: critical !== undefined ? Number(critical) : dbStore.thresholds.critical,
    };

    logSecurityEvent(
      'RISK_THRESHOLDS_UPDATED',
      req.user?.email || 'admin@payguard.io',
      'ADMIN',
      `Risk thresholds updated: Low=${dbStore.thresholds.low}, Med=${dbStore.thresholds.medium}, High=${dbStore.thresholds.high}, Crit=${dbStore.thresholds.critical}`
    );

    return res.json({
      success: true,
      message: 'Risk scoring thresholds updated successfully',
      thresholds: dbStore.thresholds,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update thresholds' });
  }
};

export const getSecurityLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = dbStore.securityLogs.slice(0, 100);
    return res.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
};
