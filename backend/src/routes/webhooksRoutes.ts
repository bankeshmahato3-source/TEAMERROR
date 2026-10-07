import { Router } from 'express';
import {
  configureWebhook,
  getWebhookConfig,
  testWebhook,
  getWebhookEvents,
} from '../controllers/webhooksController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJwt, configureWebhook);
router.get('/', authenticateJwt, getWebhookConfig);
router.post('/test', authenticateJwt, testWebhook);
router.get('/events', authenticateJwt, getWebhookEvents);

export default router;
