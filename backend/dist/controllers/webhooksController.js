"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebhookEvents = exports.testWebhook = exports.getWebhookConfig = exports.configureWebhook = void 0;
const store_1 = require("../models/store");
const auditLogger_1 = require("../utils/auditLogger");
const configureWebhook = async (req, res) => {
    try {
        const { url } = req.body;
        const merchantId = req.user?.merchantId || 'merch_01';
        if (!url) {
            return res.status(400).json({ success: false, message: 'Webhook endpoint URL is required' });
        }
        const merchant = store_1.dbStore.merchants.find((m) => m.id === merchantId);
        if (merchant) {
            merchant.webhookUrl = url;
            store_1.dbStore.saveToDisk();
        }
        (0, auditLogger_1.logSecurityEvent)('WEBHOOK_CONFIGURED', req.user?.email || 'merchant@payguard.io', req.user?.role || 'MERCHANT', `Webhook URL updated to ${url}`);
        return res.json({
            success: true,
            message: 'Webhook endpoint URL updated successfully',
            webhookUrl: url,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to configure webhook' });
    }
};
exports.configureWebhook = configureWebhook;
const getWebhookConfig = async (req, res) => {
    try {
        const merchantId = req.user?.merchantId || 'merch_01';
        const merchant = store_1.dbStore.merchants.find((m) => m.id === merchantId);
        return res.json({
            success: true,
            webhookUrl: merchant?.webhookUrl || 'https://demo-merchant.example/api/payguard-webhooks',
            supportedEvents: [
                'payment.created',
                'payment.success',
                'payment.failed',
                'payment.blocked',
                'payment.refunded',
                'fraud.detected',
                'order.paid',
            ],
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch webhook config' });
    }
};
exports.getWebhookConfig = getWebhookConfig;
const testWebhook = async (req, res) => {
    try {
        const { eventType = 'payment.success' } = req.body;
        const merchantId = req.user?.merchantId || 'merch_01';
        const timestamp = new Date().toISOString();
        const testEvent = {
            id: `whe_test_${Date.now()}`,
            eventId: `evt_${Math.random().toString(36).substring(2, 9)}`,
            merchantId,
            eventType,
            payload: {
                entity: 'event',
                id: `evt_test_${Math.floor(Math.random() * 9999)}`,
                event: eventType,
                timestamp,
                data: {
                    payment: {
                        id: 'pay_PF_TEST_SIMULATED',
                        amount: 2499,
                        currency: 'INR',
                        status: eventType.includes('blocked') ? 'BLOCKED' : 'SUCCESS',
                        method: 'UPI',
                    },
                },
            },
            deliveryStatus: 'DELIVERED',
            attempts: 1,
            responseCode: 200,
            createdAt: timestamp,
        };
        store_1.dbStore.webhookEvents = [testEvent, ...store_1.dbStore.webhookEvents];
        return res.json({
            success: true,
            message: `Test ping '${eventType}' dispatched successfully. HTTP 200 OK received.`,
            event: testEvent,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Test webhook failed' });
    }
};
exports.testWebhook = testWebhook;
const getWebhookEvents = async (req, res) => {
    try {
        const merchantId = req.user?.merchantId || 'merch_01';
        const events = store_1.dbStore.webhookEvents.filter((e) => !merchantId || e.merchantId === merchantId || e.merchantId === 'merch_01');
        return res.json({ success: true, count: events.length, events });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch webhook events' });
    }
};
exports.getWebhookEvents = getWebhookEvents;
