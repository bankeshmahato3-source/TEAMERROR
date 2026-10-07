import { TARGET_BRANDS, RISKY_TLDS, RISKY_WORDS } from '../config';

// Safe list of official domains
export const OFFICIAL_DOMAINS = new Set([
  'paytm.com', 'phonepe.com', 'pay.google.com', 'google.com',
  'razorpay.com', 'onlinesbi.sbi', 'hdfcbank.com', 'npci.org.in',
  'payguard.io'
]);

export interface LexicalResult {
  score: number; // 0 to 1
  reasons: string[];
}

export function getLevenshteinDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Decodes basic homoglyphs (e.g. 0 -> o, 1 -> l) to canonical ascii for analysis
 */
export function decodeHomoglyphs(domain: string): string {
  return domain
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/8/g, 'b');
}

export function scoreDomain(domain: string): LexicalResult {
  const reasons: string[] = [];
  let score = 0;

  // 1. Official domain allowlist check
  if (OFFICIAL_DOMAINS.has(domain)) {
    return { score: 0, reasons: ['Official domain allowlist'] };
  }

  // 2. Decode homoglyphs for analysis
  const normalized = decodeHomoglyphs(domain.toLowerCase());

  // Split into parts
  const parts = normalized.split('.');
  const tld = parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  const body = parts.slice(0, -1).join('.');

  // 3. Risky TLD
  if (RISKY_TLDS.includes(tld)) {
    score += 0.3;
    reasons.push(`Risky TLD: ${tld}`);
  }

  // 4. Hyphen / Digit patterns in body
  const hyphenCount = (body.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    score += 0.2;
    reasons.push(`Suspicious structure: ${hyphenCount} hyphens`);
  }
  
  const digitCount = (body.match(/\d/g) || []).length;
  if (digitCount >= 3) {
    score += 0.2;
    reasons.push(`Suspicious structure: excessive digits`);
  }

  // 5. Suspicious Words
  for (const word of RISKY_WORDS) {
    if (body.includes(word)) {
      score += 0.3;
      reasons.push(`Contains risky keyword: "${word}"`);
    }
  }

  // 6. Brand Impersonation (Exact or Fuzzy)
  const tokens = body.split(/[-.]/);
  
  for (const brand of TARGET_BRANDS) {
    if (body.includes(brand)) {
      score += 0.6;
      reasons.push(`Exact brand match found: "${brand}"`);
      continue;
    }

    // Fuzzy match on tokens
    for (const token of tokens) {
      if (token.length < 4) continue;
      
      const distance = getLevenshteinDistance(brand, token);
      if (distance <= 2 && distance > 0) { 
        score += 0.5;
        reasons.push(`Fuzzy brand match: "${token}" is close to "${brand}" (distance: ${distance})`);
        break; 
      }
    }
  }

  // Cap score at 1.0, round to 2 decimals
  return {
    score: Math.min(1.0, Math.round(score * 100) / 100),
    reasons
  };
}
