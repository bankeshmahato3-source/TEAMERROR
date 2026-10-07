import { refang } from '../utils/normalize';

export interface ExtractedEntities {
  urls: string[];
  upiIds: string[];
  phones: string[];
  apks: string[];
  telegramHandles: string[];
}

export function parseMessage(text: string): ExtractedEntities {
  const result: ExtractedEntities = {
    urls: [],
    upiIds: [],
    phones: [],
    apks: [],
    telegramHandles: []
  };

  if (!text) return result;

  const fangedText = refang(text);

  // URLs
  const urlRegex = /(?:https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const urls = fangedText.match(urlRegex) || [];
  for (let u of urls) {
    if (!u.startsWith('http')) {
      u = 'http://' + u;
    }
    if (u.toLowerCase().endsWith('.apk') || u.includes('.apk?')) {
      if (!result.apks.includes(u)) result.apks.push(u);
    } else {
      if (!result.urls.includes(u)) result.urls.push(u);
    }
  }

  const apkRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.apk\b/gi;
  const apks = fangedText.match(apkRegex) || [];
  for (let apk of apks) {
    let u = apk;
    if (!u.startsWith('http')) {
      u = 'http://' + u;
    }
    if (!result.apks.includes(u)) result.apks.push(u);
  }

  // UPI IDs
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/gi;
  const upis = fangedText.match(upiRegex) || [];
  for (const upi of upis) {
    if (upi.includes('.com') || upi.includes('.in') || upi.includes('.org')) {
      continue;
    }
    if (!result.upiIds.includes(upi)) result.upiIds.push(upi);
  }

  // Phones (Basic 10 digit or +91 pattern)
  const phoneRegex = /(?:\+91[\-\s]?|0)?([6-9]\d{9})\b/g;
  let match;
  while ((match = phoneRegex.exec(fangedText)) !== null) {
    const raw = match[0];
    const clean = raw.replace(/[\-\s+]/g, '');
    const normalized = clean.length === 10 ? '+91' + clean : '+' + clean;
    if (normalized.startsWith('+91') && normalized.length === 13) {
      if (!result.phones.includes(normalized)) result.phones.push(normalized);
    }
  }

  // Telegram Handles
  const tgRegex1 = /@([a-zA-Z0-9_]{5,32})\b/gi;
  while ((match = tgRegex1.exec(fangedText)) !== null) {
    const handle = match[1];
    if (!result.telegramHandles.includes(handle)) result.telegramHandles.push(handle);
  }

  const tgRegex2 = /t\.me\/([a-zA-Z0-9_]{5,32})\b/gi;
  while ((match = tgRegex2.exec(fangedText)) !== null) {
    const handle = match[1];
    if (!result.telegramHandles.includes(handle)) result.telegramHandles.push(handle);
  }

  return result;
}
