import { Router } from 'express';
import { processPayment, getPayments, getPaymentById, refundPayment } from '../controllers/paymentsController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

// Sandbox checkout process can be executed by customer
router.post('/', processPayment);
router.get('/', authenticateJwt, getPayments);
router.get('/:id', authenticateJwt, getPaymentById);
router.post('/:id/refund', authenticateJwt, refundPayment);

export default router;
