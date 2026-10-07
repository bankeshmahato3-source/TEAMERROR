"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeApiKey = exports.getApiKeys = exports.createApiKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const store_1 = require("../models/store");
const auditLogger_1 = require("../utils/auditLogger");
const createApiKey = async (req, res) => {
    try {
        const { name = 'Default Sandbox Secret Key' } = req.body;
        const merchantId = req.user?.merchantId || 'merch_01';
        const rawSecret = `pf_test_${crypto_1.default.randomBytes(16).toString('hex')}`;
        const keyPrefix = rawSecret.substring(0, 15);
        const maskedKey = `${keyPrefix}...${rawSecret.substring(rawSecret.length - 4)}`;
        const secretHash = crypto_1.default.createHash('sha256').update(rawSecret).digest('hex');
        const newKey = {
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
        store_1.dbStore.apiKeys = [newKey, ...store_1.dbStore.apiKeys];
        (0, auditLogger_1.logSecurityEvent)('API_KEY_CREATED', req.user?.email || 'merchant@payguard.io', req.user?.role || 'MERCHANT', `API Key "${name}" (${maskedKey}) generated`);
        return res.status(201).json({
            success: true,
            message: 'API Key generated. Copy this secret key now. You will not be able to see it again.',
            apiKey: {
                ...newKey,
                rawSecret, // ONLY returned once upon creation!
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to create API key' });
    }
};
exports.createApiKey = createApiKey;
const getApiKeys = async (req, res) => {
    try {
        const merchantId = req.user?.merchantId || 'merch_01';
        const keys = store_1.dbStore.apiKeys
            .filter((k) => k.merchantId === merchantId)
            .map(({ secretHash, ...rest }) => rest); // Never expose hash in read view
        return res.json({ success: true, count: keys.length, keys });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch API keys' });
    }
};
exports.getApiKeys = getApiKeys;
const revokeApiKey = async (req, res) => {
    try {
        const { id } = req.params;
        const key = store_1.dbStore.apiKeys.find((k) => k.id === id || k.keyId === id);
        if (!key) {
            return res.status(404).json({ success: false, message: 'API Key not found' });
        }
        key.revoked = true;
        store_1.dbStore.saveToDisk();
        (0, auditLogger_1.logSecurityEvent)('API_KEY_REVOKED', req.user?.email || 'merchant@payguard.io', req.user?.role || 'MERCHANT', `API Key "${key.name}" (${key.maskedKey}) revoked`);
        return res.json({ success: true, message: 'API Key has been revoked' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to revoke API key' });
    }
};
exports.revokeApiKey = revokeApiKey;
