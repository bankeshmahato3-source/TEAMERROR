import { Router } from 'express';
import { createApiKey, getApiKeys, revokeApiKey } from '../controllers/apiKeysController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJwt, createApiKey);
router.get('/', authenticateJwt, getApiKeys);
router.delete('/:id', authenticateJwt, revokeApiKey);

export default router;
