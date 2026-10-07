"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpiScannerService = void 0;
class UpiScannerService {
    static analyze(input) {
        const trimmed = input.trim();
        const isUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('.com') || trimmed.includes('.xyz') || trimmed.includes('.top') || trimmed.includes('/');
        if (isUrl) {
            return this.analyzeUrl(trimmed);
        }
        else {
            return this.analyzeVpa(trimmed);
        }
    }
    static analyzeUrl(urlStr) {
        let score = 5; // base baseline
        const indicators = [];
        let brandDetected = null;
        let scamCategory = null;
        const lower = urlStr.toLowerCase();
        // 1. Protocol check
        if (lower.startsWith('http://')) {
            score += 25;
            indicators.push({
                name: 'Insecure Protocol (HTTP)',
                status: 'FAIL',
                detail: 'The link uses unencrypted HTTP instead of HTTPS. Legitimate banking portals strictly mandate TLS/HTTPS.',
            });
        }
        else if (lower.startsWith('https://')) {
            indicators.push({
                name: 'Encrypted Protocol (HTTPS)',
                status: 'PASS',
                detail: 'The transport layer is encrypted with HTTPS.',
            });
        }
        else {
            score += 10;
            indicators.push({
                name: 'Missing Protocol Scheme',
                status: 'WARNING',
                detail: 'URL lacks explicit protocol declaration.',
            });
        }
        // 2. High-risk TLD check
        const highRiskTlds = ['.xyz', '.top', '.buzz', '.click', '.online', '.site', '.work', '.tk', '.ml', '.ga', '.cf', '.cc'];
        const matchedTld = highRiskTlds.find((tld) => lower.includes(tld));
        if (matchedTld) {
            score += 25;
            indicators.push({
                name: 'High-Risk TLD Detected',
                status: 'FAIL',
                detail: `Domain utilizes a disposable/high-abuse Top-Level Domain (${matchedTld}) frequently used in phishing campaigns.`,
            });
        }
        else {
            indicators.push({
                name: 'Standard Domain Extension',
                status: 'PASS',
                detail: 'TLD adheres to conventional commercial or organizational domain namespaces.',
            });
        }
        // 3. Brand Impersonation / Typosquatting
        const targetBrands = [
            { name: 'Paytm', terms: ['paytm', 'pay-tm', 'paytmm', 'pytm'] },
            { name: 'PhonePe', terms: ['phonepe', 'phone-pe', 'phonepee', 'fonepe'] },
            { name: 'Google Pay / GPay', terms: ['gpay', 'googlepay', 'google-pay', 'g-pay'] },
            { name: 'Razorpay', terms: ['razorpay', 'razor-pay', 'rzrpay'] },
            { name: 'State Bank of India (SBI)', terms: ['sbi', 'onlinesbi', 'sbi-card'] },
            { name: 'HDFC Bank', terms: ['hdfc', 'hdfcbank'] },
            { name: 'NPCI / BHIM', terms: ['npci', 'bhim', 'upi-india'] },
        ];
        for (const b of targetBrands) {
            for (const term of b.terms) {
                if (lower.includes(term)) {
                    brandDetected = b.name;
                    // Check if it's the genuine domain
                    const isGenuine = lower.includes('paytm.com') ||
                        lower.includes('phonepe.com') ||
                        lower.includes('google.com') ||
                        lower.includes('razorpay.com') ||
                        lower.includes('onlinesbi.sbi') ||
                        lower.includes('hdfcbank.com') ||
                        lower.includes('npci.org.in');
                    if (!isGenuine) {
                        score += 35;
                        indicators.push({
                            name: `Brand Impersonation (${b.name})`,
                            status: 'FAIL',
                            detail: `The link references ${b.name} branding keywords on an unauthorized, deceptive third-party domain.`,
                        });
                        scamCategory = 'Brand Phishing / Impersonation';
                    }
                    break;
                }
            }
            if (brandDetected && scamCategory)
                break;
        }
        // 4. Urgency & Lure Keywords
        const lureKeywords = [
            { word: 'kyc', category: 'Fake KYC Update Scam', desc: 'Demands urgent KYC verification under threat of account deactivation' },
            { word: 'lottery', category: 'Lottery / Prize Scam', desc: 'Promises fraudulent lottery or lucky draw winnings' },
            { word: 'reward', category: 'Cashback Reward Trap', desc: 'Bait claiming fake scratch cards or cash rewards' },
            { word: 'refund', category: 'Unauthorized Refund Trap', desc: 'Tricks user into clicking a collect-payment link masquerading as refund' },
            { word: 'urgent', category: 'High Pressure Tactics', desc: 'Uses artificial urgency and countdown timers to bypass rational checks' },
            { word: 'claim', category: 'Unclaimed Bonus Scam', desc: 'Requests payment credentials to release purported cash prizes' },
            { word: 'suspended', category: 'Account Block Threat', desc: 'Falsely claims debit card or net banking is frozen' },
        ];
        const matchedLures = lureKeywords.filter((k) => lower.includes(k.word));
        if (matchedLures.length > 0) {
            score += 20 * matchedLures.length;
            if (!scamCategory)
                scamCategory = matchedLures[0].category;
            indicators.push({
                name: 'Coercive / Scam Lure Keywords',
                status: 'FAIL',
                detail: `Contains psychological trigger words (${matchedLures.map((m) => `"${m.word}"`).join(', ')}). ${matchedLures[0].desc}.`,
            });
        }
        else {
            indicators.push({
                name: 'Neutral Semantic Phrasing',
                status: 'PASS',
                detail: 'No high-urgency panic language or prize baits detected in query strings.',
            });
        }
        // 5. IP Address Hostname
        const ipPattern = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        if (ipPattern.test(urlStr)) {
            score += 30;
            indicators.push({
                name: 'Direct IP Hostname',
                status: 'FAIL',
                detail: 'The URL points directly to a raw IP address instead of an authenticated domain name with certificate authority.',
            });
        }
        // 6. Excessive Subdomains or Hyphens
        const hyphensCount = (urlStr.match(/-/g) || []).length;
        if (hyphensCount >= 3) {
            score += 15;
            indicators.push({
                name: 'Deceptive Domain Structure',
                status: 'WARNING',
                detail: `Elevated hyphenation count (${hyphensCount} hyphens) typical of subdomain nesting attacks.`,
            });
        }
        // Cap score 0-100
        const finalScore = Math.min(100, Math.max(5, score));
        return this.assembleResult(urlStr, 'URL', finalScore, indicators, brandDetected, scamCategory);
    }
    static analyzeVpa(vpa) {
        let score = 10;
        const indicators = [];
        let brandDetected = null;
        let scamCategory = null;
        const lower = vpa.toLowerCase();
        // 1. Structure check: user@handle
        if (!vpa.includes('@')) {
            score += 40;
            indicators.push({
                name: 'Malformed UPI VPA Structure',
                status: 'FAIL',
                detail: 'Valid UPI Virtual Payment Addresses must conform to the username@bankhandle standard format.',
            });
            return this.assembleResult(vpa, 'VPA', 75, indicators, null, 'Malformed UPI Format');
        }
        const [userPart, handlePart] = lower.split('@');
        // 2. Known banking handles
        const legitHandles = [
            'okhdfcbank', 'okaxis', 'oksbi', 'okicici', // Google Pay
            'ybl', 'ibl', 'axl', // PhonePe
            'paytm', // Paytm
            'apl', // Amazon Pay
            'barodampay', 'federal', 'aubank', 'idfcbank', 'indus'
        ];
        const isValidHandle = legitHandles.includes(handlePart);
        if (!isValidHandle) {
            score += 20;
            indicators.push({
                name: 'Uncommon or Custom UPI PSP Handle',
                status: 'WARNING',
                detail: `@${handlePart} is not in the primary tier of high-volume verified Indian payment service providers.`,
            });
        }
        else {
            indicators.push({
                name: 'Recognized Payment Service Provider Handle',
                status: 'PASS',
                detail: `@${handlePart} is a registered UPI routing PSP handle.`,
            });
        }
        // 3. User part suspicious keywords
        const redFlags = ['customer-care', 'helpline', 'refund-dept', 'kyc-help', 'support-desk', 'cashback-winner', 'lottery'];
        const matchedFlag = redFlags.find((f) => userPart.includes(f));
        if (matchedFlag) {
            score += 50;
            indicators.push({
                name: 'Impersonation of Official Customer Support',
                status: 'FAIL',
                detail: `The UPI ID name contains "${matchedFlag}". Banks and merchants never accept payments or issue refunds via support handles!`,
            });
            scamCategory = 'Fake Support / Refund VPA Impersonation';
        }
        // 4. Test scenario identities
        if (lower === 'fraud@payguard' || lower.includes('fraud')) {
            score = 95;
            indicators.push({
                name: 'Simulated Threat Test Identity',
                status: 'FAIL',
                detail: 'Simulated high-risk blacklisted identifier in PayGuard educational sandbox.',
            });
            scamCategory = 'Known Fraud Identity Test';
        }
        else if (lower === 'success@payguard') {
            score = 5;
            indicators.push({
                name: 'Simulated Safe Merchant Identity',
                status: 'PASS',
                detail: 'Recognized sandbox benchmark merchant identity with zero complaints.',
            });
        }
        const finalScore = Math.min(100, Math.max(5, score));
        return this.assembleResult(vpa, 'VPA', finalScore, indicators, brandDetected, scamCategory);
    }
    static assembleResult(target, type, riskScore, indicators, brandDetected, scamCategory) {
        let riskLevel = 'LOW';
        let recommendation = 'SAFE TO PROCEED';
        let summary = '';
        if (riskScore < 30) {
            riskLevel = 'LOW';
            recommendation = 'SAFE TO PROCEED';
            summary = 'No evident phishing indicators, brand spoofing, or abnormal patterns detected. Appears legitimate.';
        }
        else if (riskScore < 60) {
            riskLevel = 'MEDIUM';
            recommendation = 'PROCEED WITH CAUTION';
            summary = 'Contains ambiguous attributes such as uncommon handles or lack of TLS. Double check the payee identity before proceeding.';
        }
        else if (riskScore < 80) {
            riskLevel = 'HIGH';
            recommendation = 'SUSPICIOUS - MANUAL CHECK';
            summary = 'Multiple high-risk indicators found. Elevated likelihood of deceptive lure or collect-request scam.';
        }
        else {
            riskLevel = 'CRITICAL';
            recommendation = 'DO NOT PROCEED - SCAM DETECTED';
            summary = 'CRITICAL PHISHING RISK: Strong evidence of brand spoofing, fake support impersonation, or malicious URL construction. Never enter your UPI PIN or transfer funds!';
        }
        return {
            target,
            type,
            riskScore,
            riskLevel,
            recommendation,
            summary,
            indicators,
            brandImpersonationDetected: brandDetected,
            scamCategory,
        };
    }
}
exports.UpiScannerService = UpiScannerService;
