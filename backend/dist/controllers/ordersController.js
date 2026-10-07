"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const store_1 = require("../models/store");
const auditLogger_1 = require("../utils/auditLogger");
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', customerName, customerEmail, customerPhone, description, merchantId } = req.body;
        if (!amount || !customerName || !customerEmail) {
            return res.status(400).json({ success: false, message: 'Amount, customer name, and customer email are required.' });
        }
        const effectiveMerchantId = req.user?.merchantId || merchantId || 'merch_01';
        const merchant = store_1.dbStore.merchants.find((m) => m.id === effectiveMerchantId);
        const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
        const orderId = `order_PF${randomSuffix}`;
        const newOrder = {
            id: `ord_${Date.now()}`,
            orderId,
            merchantId: effectiveMerchantId,
            merchantName: merchant?.name || 'PayGuard Sandbox Store',
            amount: Number(amount),
            currency: currency || 'INR',
            customerName,
            customerEmail: customerEmail.toLowerCase(),
            customerPhone,
            description: description || 'Sandbox Test Order',
            status: 'created',
            createdAt: new Date().toISOString(),
        };
        store_1.dbStore.orders = [newOrder, ...store_1.dbStore.orders];
        (0, auditLogger_1.logSecurityEvent)('ORDER_CREATED', req.user?.email || customerEmail, req.user?.role || 'CUSTOMER', `Order ${orderId} created for ₹${amount}`);
        return res.status(201).json({
            success: true,
            message: 'Sandbox order created successfully',
            order: newOrder,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Order creation failed' });
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        let orders = store_1.dbStore.orders;
        // If merchant, only show their orders
        if (req.user?.role === 'MERCHANT' && req.user.merchantId) {
            orders = orders.filter((o) => o.merchantId === req.user?.merchantId);
        }
        return res.json({ success: true, count: orders.length, orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = store_1.dbStore.orders.find((o) => o.orderId === orderId || o.id === orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: `Order ${orderId} not found` });
        }
        const merchant = store_1.dbStore.merchants.find((m) => m.id === order.merchantId);
        return res.json({
            success: true,
            order: {
                ...order,
                merchantName: merchant?.name || order.merchantName || 'Sandbox Merchant',
                merchantCategory: merchant?.category || 'E-Commerce',
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch order' });
    }
};
exports.getOrderById = getOrderById;
