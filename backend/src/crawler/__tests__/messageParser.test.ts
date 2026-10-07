import { describe, it, expect } from 'vitest';
import { parseMessage } from '../intake/messageParser';

describe('Message Parser', () => {
  it('extracts normal URLs', () => {
    const res = parseMessage('Please verify your KYC at http://paytm-kyc.com');
    expect(res.urls).toContain('http://paytm-kyc.com');
  });

  it('extracts defanged URLs', () => {
    const res = parseMessage('Do not click hxxp://badsite[.]com');
    expect(res.urls).toContain('http://badsite.com');
  });

  it('extracts UPI IDs but ignores emails', () => {
    const res = parseMessage('Pay me at user123@ybl. Do not email test@example.com.');
    expect(res.upiIds).toContain('user123@ybl');
    expect(res.upiIds).not.toContain('test@example.com');
  });

  it('extracts phone numbers and normalizes them', () => {
    const res = parseMessage('Call customer care at 9876543210 or +91 9999999999');
    expect(res.phones).toContain('+919876543210');
    expect(res.phones).toContain('+919999999999');
  });

  it('extracts telegram handles', () => {
    const res = parseMessage('Contact @Scammer_Bot or t.me/badguy123 for refund');
    expect(res.telegramHandles).toContain('Scammer_Bot');
    expect(res.telegramHandles).toContain('badguy123');
  });

  it('extracts APK links separately', () => {
    const res = parseMessage('Download app from http://example.com/app.apk');
    expect(res.apks).toContain('http://example.com/app.apk');
    expect(res.urls).not.toContain('http://example.com/app.apk');
  });

  it('handles multiple entities in one tricky SMS', () => {
    const msg = `URGENT! Your HDFC acc is blocked. Update PAN at hxxp://hdfc-pan-update[.]xyz or call +91-8888888888. Pay fee to hdfc.fee@sbi. TG: @hdfc_support`;
    const res = parseMessage(msg);
    expect(res.urls).toContain('http://hdfc-pan-update.xyz');
    expect(res.phones).toContain('+918888888888');
    expect(res.upiIds).toContain('hdfc.fee@sbi');
    expect(res.telegramHandles).toContain('hdfc_support');
  });
});
