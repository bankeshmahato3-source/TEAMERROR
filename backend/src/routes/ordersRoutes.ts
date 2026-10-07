import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/ordersController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

// Order creation can be public or merchant authenticated
router.post('/', createOrder);
router.get('/', authenticateJwt, getOrders);
router.get('/:orderId', getOrderById);

export default router;
