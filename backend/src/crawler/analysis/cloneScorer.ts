import fs from 'fs';
import { FetchResult } from '../fetch/fetcher';
import { LexicalResult } from './lexicalFilter';

export interface CloneScoreResult {
  score: number;
  reasons: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export function calculateCloneScore(lexical: LexicalResult, fetchResult: FetchResult): CloneScoreResult {
  let score = lexical.score * 100;
  const reasons = [...lexical.reasons];

  if (fetchResult.error) {
    score += 10;
    reasons.push(`Fetch Error: ${fetchResult.error}`);
  }

  let domText = '';
  try {
    if (fetchResult.domPath && fs.existsSync(fetchResult.domPath)) {
      domText = fs.readFileSync(fetchResult.domPath, 'utf-8').toLowerCase();
    }
  } catch (e) {}

  if (domText) {
    if (domText.includes('type="password"') || domText.includes("type='password'")) {
      score += 20;
      reasons.push('Contains password input field');
    }
    if (domText.includes('otp') || domText.includes('one time password') || domText.includes('one-time password')) {
      score += 20;
      reasons.push('Contains OTP references');
    }
    if (domText.includes('mpin') || domText.includes('m-pin')) {
      score += 15;
      reasons.push('Contains MPIN references');
    }
  }

  if (fetchResult.postTargets.length > 0) {
    try {
      const originalHost = new URL(fetchResult.finalUrl || 'http://localhost').hostname;
      for (const target of fetchResult.postTargets) {
        try {
          const targetHost = new URL(target).hostname;
          if (targetHost !== originalHost && targetHost !== '') {
            score += 30;
            reasons.push(`Form posts to third-party domain: ${targetHost}`);
            break;
          }
        } catch (e) {}
      }
    } catch (e) {}
  }

  for (const req of fetchResult.networkRequests) {
    if (req.url.includes('api.telegram.org/bot')) {
      score += 40;
      reasons.push('Exfiltrates data to Telegram Bot API');
      break;
    }
  }

  score = Math.min(100, Math.round(score));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (score >= 80) riskLevel = 'CRITICAL';
  else if (score >= 60) riskLevel = 'HIGH';
  else if (score >= 30) riskLevel = 'MEDIUM';

  return { score, reasons, riskLevel };
}
