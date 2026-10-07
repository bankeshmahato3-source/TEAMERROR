import { Router } from 'express';
import { checkUpiOrLink } from '../controllers/upiController';

const router = Router();

router.post('/check', checkUpiOrLink);

export default router;
