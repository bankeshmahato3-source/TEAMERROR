import { Response } from 'express';
import { dbStore } from '../models/store';
import { AuthenticatedRequest } from '../middleware/auth';
import { logSecurityEvent } from '../utils/auditLogger';
import { IOrder } from '../types';

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, currency = 'INR', customerName, customerEmail, customerPhone, description, merchantId } = req.body;

    if (!amount || !customerName || !customerEmail) {
      return res.status(400).json({ success: false, message: 'Amount, customer name, and customer email are required.' });
    }

    const effectiveMerchantId = req.user?.merchantId || merchantId || 'merch_01';
    const merchant = dbStore.merchants.find((m) => m.id === effectiveMerchantId);

    const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    const orderId = `order_PF${randomSuffix}`;

    const newOrder: IOrder = {
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

    dbStore.orders = [newOrder, ...dbStore.orders];

    logSecurityEvent(
      'ORDER_CREATED',
      req.user?.email || customerEmail,
      req.user?.role || 'CUSTOMER',
      `Order ${orderId} created for ₹${amount}`
    );

    return res.status(201).json({
      success: true,
      message: 'Sandbox order created successfully',
      order: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Order creation failed' });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let orders = dbStore.orders;

    // If merchant, only show their orders
    if (req.user?.role === 'MERCHANT' && req.user.merchantId) {
      orders = orders.filter((o) => o.merchantId === req.user?.merchantId);
    }

    return res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = dbStore.orders.find((o) => o.orderId === orderId || o.id === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: `Order ${orderId} not found` });
    }

    const merchant = dbStore.merchants.find((m) => m.id === order.merchantId);

    return res.json({
      success: true,
      order: {
        ...order,
        merchantName: merchant?.name || order.merchantName || 'Sandbox Merchant',
        merchantCategory: merchant?.category || 'E-Commerce',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};
