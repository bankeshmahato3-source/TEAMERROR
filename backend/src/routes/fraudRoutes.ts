import { Router } from 'express';
import {
  analyzeAdHoc,
  getFraudAlerts,
  updateAlertStatus,
  getFraudInvestigation,
  runSimulation,
} from '../controllers/fraudController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.post('/analyze', analyzeAdHoc);
router.post('/simulate', runSimulation);
router.get('/alerts', authenticateJwt, getFraudAlerts);
router.patch('/alerts/:id', authenticateJwt, updateAlertStatus);
router.get('/:paymentId', authenticateJwt, getFraudInvestigation);

export default router;
