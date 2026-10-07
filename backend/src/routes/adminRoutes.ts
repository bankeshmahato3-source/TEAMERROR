import { Router } from 'express';
import {
  getAdminUsers,
  getAdminMerchants,
  toggleMerchantStatus,
  getFraudRules,
  updateFraudRule,
  updateThresholds,
  getSecurityLogs,
} from '../controllers/adminController';
import { authenticateJwt, requireRoles } from '../middleware/auth';

const router = Router();

// Restricted to ADMIN & SECURITY_ANALYST
router.use(authenticateJwt);
router.use(requireRoles(['ADMIN', 'SECURITY_ANALYST']));

router.get('/users', getAdminUsers);
router.get('/merchants', getAdminMerchants);
router.patch('/merchants/:id/status', requireRoles(['ADMIN']), toggleMerchantStatus);
router.get('/fraud-rules', getFraudRules);
router.patch('/fraud-rules/:id', requireRoles(['ADMIN']), updateFraudRule);
router.patch('/thresholds', requireRoles(['ADMIN']), updateThresholds);
router.get('/logs', getSecurityLogs);

export default router;
