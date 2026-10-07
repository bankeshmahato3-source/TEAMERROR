import { Router } from 'express';
import { register, login, getMe, demoRoleSwitch } from '../controllers/authController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJwt, getMe);
router.post('/demo-switch', demoRoleSwitch);

export default router;
