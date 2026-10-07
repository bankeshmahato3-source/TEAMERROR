import { Response } from 'express';
import crypto from 'crypto';
import { dbStore } from '../models/store';
import { AuthenticatedRequest } from '../middleware/auth';
import { logSecurityEvent } from '../utils/auditLogger';
import { IApiKey } from '../types';

export const createApiKey = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name = 'Default Sandbox Secret Key' } = req.body;
    const merchantId = req.user?.merchantId || 'merch_01';

    const rawSecret = `pf_test_${crypto.randomBytes(16).toString('hex')}`;
    const keyPrefix = rawSecret.substring(0, 15);
    const maskedKey = `${keyPrefix}...${rawSecret.substring(rawSecret.length - 4)}`;
    const secretHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

    const newKey: IApiKey = {
      id: `key_${Date.now()}`,
      keyId: `key_${Math.random().toString(36).substring(2, 9)}`,
      merchantId,
      name,
      keyPrefix,
      maskedKey,
      secretHash,
      environment: 'sandbox',
      revoked: false,
      lastUsed: 'Just now',
      createdAt: new Date().toISOString(),
    };

    dbStore.apiKeys = [newKey, ...dbStore.apiKeys];

    logSecurityEvent(
      'API_KEY_CREATED',
      req.user?.email || 'merchant@payguard.io',
      req.user?.role || 'MERCHANT',
      `API Key "${name}" (${maskedKey}) generated`
    );

    return res.status(201).json({
      success: true,
      message: 'API Key generated. Copy this secret key now. You will not be able to see it again.',
      apiKey: {
        ...newKey,
        rawSecret, // ONLY returned once upon creation!
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create API key' });
  }
};

export const getApiKeys = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const merchantId = req.user?.merchantId || 'merch_01';
    const keys = dbStore.apiKeys
      .filter((k) => k.merchantId === merchantId)
      .map(({ secretHash, ...rest }) => rest); // Never expose hash in read view

    return res.json({ success: true, count: keys.length, keys });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch API keys' });
  }
};

export const revokeApiKey = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const key = dbStore.apiKeys.find((k) => k.id === id || k.keyId === id);

    if (!key) {
      return res.status(404).json({ success: false, message: 'API Key not found' });
    }

    key.revoked = true;
    dbStore.saveToDisk();

    logSecurityEvent(
      'API_KEY_REVOKED',
      req.user?.email || 'merchant@payguard.io',
      req.user?.role || 'MERCHANT',
      `API Key "${key.name}" (${key.maskedKey}) revoked`
    );

    return res.json({ success: true, message: 'API Key has been revoked' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to revoke API key' });
  }
};
