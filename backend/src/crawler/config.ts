import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

export const CRAWLER_ENABLED = process.env.CRAWLER_ENABLED === 'true';
export const CRAWLER_SOURCE = process.env.CRAWLER_SOURCE || 'fixture';
export const CERTSTREAM_URL = process.env.CERTSTREAM_URL || 'wss://certstream.calidog.io/';
export const EVIDENCE_DIR = process.env.EVIDENCE_DIR || path.join(__dirname, '../../../data/crawler/evidence');
export const CONCURRENCY = parseInt(process.env.CONCURRENCY || '5', 10);
export const SALT = process.env.SALT || 'payguard_crawler_salt_123';

// Brand list for lexical analysis
export const TARGET_BRANDS = [
  'paytm', 'phonepe', 'gpay', 'googlepay', 'razorpay', 'sbi', 'hdfc', 'npci', 'bhim',
  // Sandbox specific
  'payguard'
];

export const RISKY_TLDS = ['.xyz', '.top', '.buzz', '.click', '.online', '.site', '.work', '.tk', '.ml', '.ga', '.cf', '.cc'];
export const RISKY_WORDS = ['login', 'secure', 'verify', 'kyc', 'update', 'refund', 'cashback', 'reward', 'support'];
