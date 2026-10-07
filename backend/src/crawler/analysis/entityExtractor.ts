import crypto from 'crypto';
import fs from 'fs';
import { FetchResult } from '../fetch/fetcher';
import { CrawlerEntity } from '../types';
import { parseMessage } from '../intake/messageParser';

export function extractEntities(candidateId: string, fetchResult: FetchResult): CrawlerEntity[] {
  const entities: CrawlerEntity[] = [];

  const addEntity = (type: CrawlerEntity['type'], value: string) => {
    if (!value) return;
    const cleanValue = value.trim();
    if (!cleanValue) return;
    
    const id = `ent_${crypto.createHash('md5').update(`${type}:${cleanValue}`).digest('hex').substring(0, 16)}`;
    
    const existing = entities.find(e => e.id === id);
    if (!existing) {
      entities.push({ id, type, value: cleanValue, candidateIds: [candidateId], campaignIds: [] });
    }
  };

  // 1. Kit Fingerprint
  const sortedClasses = [...fetchResult.cssClasses].sort();
  const sortedScripts = [...fetchResult.scriptSources].map(s => {
      try {
          const u = new URL(s);
          return u.pathname.split('/').pop() || '';
      } catch {
          return s.split('/').pop() || '';
      }
  }).sort();
  
  const kitString = sortedClasses.join('|') + '||' + sortedScripts.join('|');
  
  if (sortedClasses.length > 0 || sortedScripts.length > 0) {
    const kitHash = crypto.createHash('sha256').update(kitString).digest('hex');
    addEntity('DOM_FINGERPRINT', kitHash);
  }

  // 2. Favicon
  if (fetchResult.faviconUrl) {
    addEntity('FAVICON_HASH', fetchResult.faviconUrl);
  }

  // 3. Form POST targets
  for (const target of fetchResult.postTargets) {
    try {
      const url = new URL(target);
      addEntity('FORM_POST', url.hostname);
    } catch {
      // Relative path or invalid
    }
  }

  // 4. Telegram API
  for (const req of fetchResult.networkRequests) {
    if (req.url.includes('api.telegram.org/bot')) {
      const match = req.url.match(/bot([a-zA-Z0-9_-]+)/);
      if (match) {
        addEntity('TELEGRAM_BOT', match[1]);
      }
    }
  }

  // 5. Parse DOM text for static indicators
  let domText = '';
  try {
    if (fetchResult.domPath && fs.existsSync(fetchResult.domPath)) {
      domText = fs.readFileSync(fetchResult.domPath, 'utf-8');
    }
  } catch (err) {
    // Ignore
  }

  if (domText) {
    const extracted = parseMessage(domText);
    for (const upi of extracted.upiIds) addEntity('UPI', upi);
    for (const phone of extracted.phones) addEntity('PHONE', phone);
    for (const tg of extracted.telegramHandles) addEntity('TELEGRAM_BOT', tg);
  }

  if (fetchResult.tlsIssuer) {
    addEntity('CERTIFICATE', fetchResult.tlsIssuer);
  }

  return entities;
}
