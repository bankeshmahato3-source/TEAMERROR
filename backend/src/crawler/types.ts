export type DetectionStatus = 'PENDING' | 'FETCHED' | 'FAILED' | 'CONFIRMED' | 'REJECTED';

export interface RawCandidate {
  url?: string;
  upiId?: string;
  phone?: string;
  apkUrl?: string;
  telegramHandle?: string;
  sourceId: string;
  firstSeen: number;
  note?: string;
}

export interface CrawlerCandidate {
  id: string; // e.g. crl_det_1234
  normalizedUrl?: string;
  originalUrl?: string;
  upiId?: string;
  phone?: string;
  apkUrl?: string;
  telegramHandle?: string;
  sourceRefs: Array<{ sourceId: string; timestamp: number; note?: string }>;
  status: DetectionStatus;
  firstSeen: string; // ISO 8601
  lastUpdated: string; // ISO 8601
  
  // Scoring
  lexicalScore?: number;
  cloneScore?: number;
  finalScore?: number; // 0-100
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scoreReasons?: string[];
  
  campaignId?: string;
}

export interface CrawlerEvidence {
  id: string;
  candidateId: string;
  timestamp: string;
  screenshotHash?: string;
  screenshotPath?: string;
  domHash?: string;
  domPath?: string;
  redirectChain: string[];
  finalUrl?: string;
  networkRequestsCount?: number;
  tlsIssuer?: string;
  fetchError?: string;
}

export interface CrawlerEntity {
  id: string;
  type: 'FORM_POST' | 'TELEGRAM_BOT' | 'UPI' | 'PHONE' | 'FAVICON_HASH' | 'DOM_FINGERPRINT' | 'IP' | 'CERTIFICATE';
  value: string;
  candidateIds: string[];
  campaignIds: string[];
}

export interface CrawlerCampaign {
  id: string; // e.g. crl_cmp_1234
  name: string;
  status: 'ACTIVE' | 'MITIGATED' | 'FALSE_POSITIVE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  firstSeen: string;
  lastUpdated: string;
  candidateIds: string[];
  entityIds: string[];
  description?: string;
}

export interface Source {
  name: string;
  stream(): AsyncIterable<RawCandidate>;
}
