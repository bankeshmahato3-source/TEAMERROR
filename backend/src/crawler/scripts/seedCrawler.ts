import { dbStore } from '../../models/store';
import { CrawlerCandidate, CrawlerCampaign } from '../types';

export function seedCrawlerData() {
  console.log('[SeedCrawler] Injecting mock detections and campaigns...');

  const cand1: CrawlerCandidate = {
    id: 'crl_det_a1b2c3d4',
    normalizedUrl: 'http://paytm-kyc-verify.buzz',
    originalUrl: 'paytm-kyc-verify.buzz',
    status: 'FETCHED',
    firstSeen: new Date(Date.now() - 86400000).toISOString(),
    lastUpdated: new Date().toISOString(),
    sourceRefs: [{ sourceId: 'fixture', timestamp: Date.now() }],
    lexicalScore: 0.9,
    cloneScore: 95,
    finalScore: 95,
    riskLevel: 'CRITICAL',
    scoreReasons: ['Exact brand match found: "paytm"', 'Contains password input field', 'Form posts to third-party domain: badguy.ru'],
    campaignId: 'crl_cmp_xyz789'
  };

  const cand2: CrawlerCandidate = {
    id: 'crl_det_e5f6g7h8',
    normalizedUrl: 'http://hdfcbank-rewards.xyz',
    originalUrl: 'hdfcbank-rewards.xyz',
    status: 'CONFIRMED',
    firstSeen: new Date(Date.now() - 3600000).toISOString(),
    lastUpdated: new Date().toISOString(),
    sourceRefs: [{ sourceId: 'certstream', timestamp: Date.now() }],
    lexicalScore: 0.8,
    cloneScore: 85,
    finalScore: 85,
    riskLevel: 'CRITICAL',
    scoreReasons: ['Exact brand match found: "hdfc"', 'Contains OTP references'],
    campaignId: 'crl_cmp_xyz789'
  };

  const cand3: CrawlerCandidate = {
    id: 'crl_det_i9j0k1l2',
    normalizedUrl: 'http://amazon-pay-support.online',
    originalUrl: 'amazon-pay-support.online',
    status: 'FETCHED',
    firstSeen: new Date(Date.now() - 7200000).toISOString(),
    lastUpdated: new Date().toISOString(),
    sourceRefs: [{ sourceId: 'crtsh', timestamp: Date.now() }],
    lexicalScore: 0.6,
    cloneScore: 40,
    finalScore: 40,
    riskLevel: 'MEDIUM',
    scoreReasons: ['Risky TLD: .online', 'Contains risky keyword: "support"']
  };

  const camp1: CrawlerCampaign = {
    id: 'crl_cmp_xyz789',
    name: 'Threat Campaign xyz789',
    status: 'ACTIVE',
    riskLevel: 'CRITICAL',
    firstSeen: new Date(Date.now() - 86400000).toISOString(),
    lastUpdated: new Date().toISOString(),
    candidateIds: [cand1.id, cand2.id],
    entityIds: []
  };

  dbStore.crawlerCandidates = [cand1, cand2, cand3, ...dbStore.crawlerCandidates];
  dbStore.crawlerCampaigns = [camp1, ...dbStore.crawlerCampaigns];

  console.log('[SeedCrawler] Done injecting mock crawler data.');
}

if (require.main === module) {
  seedCrawlerData();
  process.exit(0);
}
