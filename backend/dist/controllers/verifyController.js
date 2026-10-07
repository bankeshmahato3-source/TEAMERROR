"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentOrOrder = void 0;
const store_1 = require("../models/store");
const verifyPaymentOrOrder = async (req, res) => {
    try {
        const { identifier } = req.params;
        const cleanId = identifier.trim();
        // Check paymentId
        let payment = store_1.dbStore.payments.find((p) => p.paymentId.toLowerCase() === cleanId.toLowerCase() || p.id.toLowerCase() === cleanId.toLowerCase());
        // If not found by payment, check by orderId
        if (!payment) {
            payment = store_1.dbStore.payments.find((p) => p.orderId.toLowerCase() === cleanId.toLowerCase());
        }
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: `No sandbox record found matching identifier "${identifier}". Ensure this is an authentic PayGuard sandbox reference ID.`,
            });
        }
        const order = store_1.dbStore.orders.find((o) => o.orderId === payment?.orderId);
        const merchant = store_1.dbStore.merchants.find((m) => m.id === payment?.merchantId);
        return res.json({
            success: true,
            verification: {
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                method: payment.method,
                merchantName: merchant?.name || payment.merchantName,
                customerName: payment.customerName,
                timestamp: payment.createdAt,
                riskScore: payment.riskScore,
                riskLevel: payment.riskLevel,
                isVerifiedSandbox: true,
                disclaimer: 'Sandbox verification record only. PayGuard does not process real monetary transactions.',
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Verification lookup failed' });
    }
};
exports.verifyPaymentOrOrder = verifyPaymentOrOrder;
