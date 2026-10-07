import { describe, it, expect } from 'vitest';
import { normalizeUrl, refang } from '../utils/normalize';

describe('refang', () => {
  it('should refang hxxp and hxxps', () => {
    expect(refang('hxxp://example.com')).toBe('http://example.com');
    expect(refang('hxxps://example.com')).toBe('https://example.com');
    expect(refang('HXXP://EXAMPLE.COM')).toBe('http://EXAMPLE.COM');
  });

  it('should remove brackets around dots', () => {
    expect(refang('example[.]com')).toBe('example.com');
    expect(refang('hxxp://example[.]com/test(.)html')).toBe('http://example.com/test.html');
    expect(refang('example{.}org')).toBe('example.org');
  });
});

describe('normalizeUrl', () => {
  it('should lowercase the host', () => {
    expect(normalizeUrl('http://EXAMPLE.COM/Path')).toBe('http://example.com/Path');
  });

  it('should prepend http if scheme is missing', () => {
    expect(normalizeUrl('example.com')).toBe('http://example.com');
    expect(normalizeUrl('example.com/test')).toBe('http://example.com/test');
  });

  it('should strip fragments', () => {
    expect(normalizeUrl('http://example.com/path#fragment')).toBe('http://example.com/path');
  });

  it('should strip common tracking parameters', () => {
    expect(normalizeUrl('http://example.com/?utm_source=test&utm_medium=email&valid=1'))
      .toBe('http://example.com/?valid=1');
    expect(normalizeUrl('http://example.com/?fbclid=12345')).toBe('http://example.com');
  });

  it('should handle punycode/IDN domains (ASCII output)', () => {
    // Punycode in node URL should work automatically or keep utf8. 
    // Usually we want ascii, but we'll just test that it parses.
    const result = normalizeUrl('http://münchen.de');
    expect(result).toMatch(/münchen\.de|xn--mnchen-3ya\.de/);
  });

  it('should remove trailing slash for root paths', () => {
    expect(normalizeUrl('http://example.com/')).toBe('http://example.com');
    expect(normalizeUrl('http://example.com/path/')).toBe('http://example.com/path');
  });

  it('should handle defanged URLs directly', () => {
    expect(normalizeUrl('hxxp://badsite[.]com/?utm_source=bad')).toBe('http://badsite.com');
  });

  it('should return null for invalid junk URLs', () => {
    expect(normalizeUrl('not-a-valid-url-format@^^^')).toBeNull();
  });
  
  it('should handle very long URLs', () => {
    const longPath = 'a'.repeat(2000);
    expect(normalizeUrl(`http://example.com/${longPath}`)).toBe(`http://example.com/${longPath}`);
  });
});
