import { Router } from 'express';
import { verifyPaymentOrOrder } from '../controllers/verifyController';

const router = Router();

router.get('/:identifier', verifyPaymentOrOrder);

export default router;
