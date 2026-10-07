import { Router } from 'express';
import { authenticateJwt, requireRoles } from '../../middleware/auth';
import {
  getDetections,
  getDetectionById,
  setDetectionDecision,
  getCampaigns,
  getCampaignById,
  submitReport,
  getMetrics
} from './crawlerController';
import { startManualCrawl, getManualCrawlStatus, stopManualCrawl, analyzeManualUrl } from './manualCrawler';

const router = Router();

// Only SECURITY_ANALYST and ADMIN can access crawler data
router.use(authenticateJwt, requireRoles(['SECURITY_ANALYST', 'ADMIN']));

router.get('/detections', getDetections);
router.get('/detections/:id', getDetectionById);
router.post('/detections/:id/decision', setDetectionDecision);

router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaignById);

router.post('/report', submitReport);
router.get('/metrics', getMetrics);

// Simple Manual Crawler Routes
router.post('/manual/start', startManualCrawl);
router.get('/manual/status/:jobId', getManualCrawlStatus);
router.post('/manual/stop/:jobId', stopManualCrawl);
router.post('/manual/analyze', analyzeManualUrl);

export default router;
