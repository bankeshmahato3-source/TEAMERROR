import { describe, it, expect } from 'vitest';
import { scoreDomain, decodeHomoglyphs, getLevenshteinDistance } from '../analysis/lexicalFilter';

describe('Lexical Filter', () => {
  describe('getLevenshteinDistance', () => {
    it('calculates correct distance', () => {
      expect(getLevenshteinDistance('paytm', 'paytn')).toBe(1);
      expect(getLevenshteinDistance('phonepe', 'phoneee')).toBe(1);
      expect(getLevenshteinDistance('razorpay', 'razorpayy')).toBe(1);
    });
  });

  describe('decodeHomoglyphs', () => {
    it('decodes numbers to letters', () => {
      expect(decodeHomoglyphs('p4ytm')).toBe('paytm');
      expect(decodeHomoglyphs('ph0n3p3')).toBe('phonepe');
      expect(decodeHomoglyphs('r4z0rp4y')).toBe('razorpay');
    });
  });

  describe('scoreDomain', () => {
    it('returns 0 for official domains', () => {
      expect(scoreDomain('paytm.com').score).toBe(0);
      expect(scoreDomain('razorpay.com').score).toBe(0);
    });

    it('penalizes risky TLDs', () => {
      const result = scoreDomain('random.xyz');
      expect(result.score).toBe(0.3);
      expect(result.reasons).toContain('Risky TLD: .xyz');
    });

    it('penalizes suspicious words', () => {
      const result = scoreDomain('random-login.com');
      expect(result.score).toBe(0.3);
      expect(result.reasons).toContain('Contains risky keyword: "login"');
    });

    it('penalizes brand impersonation', () => {
      const result = scoreDomain('paytm-support.com');
      expect(result.score).toBeGreaterThanOrEqual(0.6);
      expect(result.reasons).toContain('Exact brand match found: "paytm"');
    });

    it('penalizes fuzzy brand impersonation', () => {
      const result = scoreDomain('p4ytm-support.com');
      expect(result.score).toBeGreaterThanOrEqual(0.6);
      
      const result2 = scoreDomain('paytn-support.com');
      expect(result2.score).toBeGreaterThanOrEqual(0.5);
      expect(result2.reasons.some(r => r.includes('Fuzzy brand match'))).toBe(true);
    });

    it('combines signals and caps at 1.0', () => {
      const result = scoreDomain('paytm-login-verify-88.xyz');
      expect(result.score).toBe(1.0);
      expect(result.reasons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Precision / Recall on Fixtures', () => {
    it('evaluates domains.csv and prints precision/recall', () => {
      const fs = require('fs');
      const path = require('path');
      const csvPath = path.join(__dirname, '../fixtures/domains.csv');
      const content = fs.readFileSync(csvPath, 'utf-8');
      
      const lines = content.split('\n').map((l: string) => l.trim()).filter((l: string) => l && !l.startsWith('domain'));
      
      let truePositives = 0;
      let falsePositives = 0;
      let trueNegatives = 0;
      let falseNegatives = 0;
      
      // Threshold for "suspicious"
      const THRESHOLD = 0.5;

      for (const line of lines) {
        const [domain, labelStr] = line.split(',');
        const label = parseInt(labelStr, 10);
        const { score } = scoreDomain(domain);
        const isSuspicious = score >= THRESHOLD;
        
        if (isSuspicious && label === 1) truePositives++;
        else if (isSuspicious && label === 0) falsePositives++;
        else if (!isSuspicious && label === 0) trueNegatives++;
        else if (!isSuspicious && label === 1) falseNegatives++;
      }
      
      const precision = truePositives / (truePositives + falsePositives || 1);
      const recall = truePositives / (truePositives + falseNegatives || 1);
      
      console.log(`\nLexical Filter Metrics (Threshold: ${THRESHOLD})`);
      console.log(`Precision: ${(precision * 100).toFixed(2)}%`);
      console.log(`Recall: ${(recall * 100).toFixed(2)}%`);
      console.log(`TP: ${truePositives}, FP: ${falsePositives}, TN: ${trueNegatives}, FN: ${falseNegatives}\n`);
      
      // We expect reasonable performance on this simple fixture
      expect(precision).toBeGreaterThan(0.7);
      expect(recall).toBeGreaterThan(0.7);
    });
  });
});
