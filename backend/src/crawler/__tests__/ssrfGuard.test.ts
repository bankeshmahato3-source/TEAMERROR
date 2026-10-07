import { describe, it, expect } from 'vitest';
import { checkIP, SSRFError } from '../fetch/ssrfGuard';

describe('SSRF Guard', () => {
  it('allows safe public IPs', () => {
    expect(checkIP('8.8.8.8')).toBe('8.8.8.8');
    expect(checkIP('1.1.1.1')).toBe('1.1.1.1');
    expect(checkIP('104.21.5.1')).toBe('104.21.5.1');
  });

  it('blocks loopback IPs', () => {
    expect(() => checkIP('127.0.0.1')).toThrow(SSRFError);
    expect(() => checkIP('127.0.1.1')).toThrow(SSRFError);
    expect(() => checkIP('::1')).toThrow(SSRFError);
  });

  it('blocks private IPs', () => {
    expect(() => checkIP('10.0.0.1')).toThrow(SSRFError);
    expect(() => checkIP('172.16.0.1')).toThrow(SSRFError);
    expect(() => checkIP('192.168.1.1')).toThrow(SSRFError);
  });

  it('blocks link-local IPs (cloud metadata)', () => {
    expect(() => checkIP('169.254.169.254')).toThrow(SSRFError);
    expect(() => checkIP('169.254.0.1')).toThrow(SSRFError);
  });

  it('throws on invalid IP', () => {
    expect(() => checkIP('not.an.ip')).toThrow(SSRFError);
  });
});
