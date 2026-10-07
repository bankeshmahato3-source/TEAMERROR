import { Router } from 'express';
import { getDashboardStats, getDashboardAnalytics } from '../controllers/dashboardController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateJwt, getDashboardStats);
router.get('/analytics', authenticateJwt, getDashboardAnalytics);

export default router;
