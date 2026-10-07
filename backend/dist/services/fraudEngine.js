"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionEngine = void 0;
const store_1 = require("../models/store");
class FraudDetectionEngine {
    /**
     * Evaluates a transaction against configured rules and dynamic heuristics.
     * Produces explainable reasons, point breakdown, and recommendation.
     */
    static analyze(input) {
        const rules = store_1.dbStore.fraudRules;
        const ruleMap = new Map();
        rules.forEach((r) => ruleMap.set(r.ruleId, r));
        const triggeredRules = [];
        const reasons = [];
        let totalScore = 0;
        // Feature Extractors & Calculations
        const existingPayments = store_1.dbStore.payments;
        const customerPayments = existingPayments.filter((p) => p.customerEmail.toLowerCase() === input.customerEmail.toLowerCase());
        // 1. Amount Anomaly Check
        let avgAmount = 2500; // baseline benchmark
        if (customerPayments.length > 0) {
            const sum = customerPayments.reduce((acc, p) => acc + p.amount, 0);
            avgAmount = sum / customerPayments.length;
        }
        const amountRatio = Number((input.amount / (avgAmount || 1)).toFixed(2));
        const highAmountRule = ruleMap.get('RULE_HIGH_AMOUNT');
        if (highAmountRule?.enabled) {
            if (input.amount >= 25000 || amountRatio >= 3.5) {
                const points = highAmountRule.weight;
                totalScore += points;
                triggeredRules.push({
                    ruleId: highAmountRule.ruleId,
                    ruleName: highAmountRule.name,
                    pointsAdded: points,
                    description: `Transaction amount (₹${input.amount.toLocaleString()}) is ${amountRatio}× customer historical average`,
                });
                reasons.push(`Unusual transaction amount: ₹${input.amount.toLocaleString()} is ${amountRatio}× above baseline pattern`);
            }
        }
        // 2. Velocity Check (attempts within last 5 minutes)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const recentAttempts = existingPayments.filter((p) => {
            const isSameCustomer = p.customerEmail.toLowerCase() === input.customerEmail.toLowerCase();
            const isSameIp = input.clientIp && p.clientIp === input.clientIp;
            const paymentTime = new Date(p.createdAt).getTime();
            return (isSameCustomer || isSameIp) && paymentTime > fiveMinutesAgo;
        });
        const velocityRule = ruleMap.get('RULE_VELOCITY');
        const velocityCount = recentAttempts.length;
        if (velocityRule?.enabled) {
            if (velocityCount >= 3) {
                const points = velocityRule.weight;
                totalScore += points;
                triggeredRules.push({
                    ruleId: velocityRule.ruleId,
                    ruleName: velocityRule.name,
                    pointsAdded: points,
                    description: `High velocity detected: ${velocityCount} payment attempts within the last 5 minutes`,
                });
                reasons.push(`Abnormal transaction velocity: ${velocityCount} rapid checkout attempts from same identity/network`);
            }
        }
        // 3. New / Unrecognized Device Check
        const deviceRule = ruleMap.get('RULE_NEW_DEVICE');
        const knownDevices = new Set(customerPayments.map((p) => p.device).filter(Boolean));
        const isNewDevice = Boolean(input.device && !knownDevices.has(input.device));
        if (deviceRule?.enabled && isNewDevice && customerPayments.length > 0) {
            const points = deviceRule.weight;
            totalScore += points;
            triggeredRules.push({
                ruleId: deviceRule.ruleId,
                ruleName: deviceRule.name,
                pointsAdded: points,
                description: `Unrecognized device fingerprint: "${input.device}" not associated with past account history`,
            });
            reasons.push(`New device fingerprint detected without prior authentication footprint`);
        }
        // 4. Suspicious IP Check
        const suspiciousIpRule = ruleMap.get('RULE_SUSPICIOUS_IP');
        const SUSPICIOUS_IPS = [
            '185.220.101.5', // Known Tor exit node mock
            '45.154.255.89', // VPN/Proxy mock
            '194.26.29.112', // Bulletproof host mock
            '103.151.124.9', // Flagged botnet subnet
            '198.51.100.42', // Synthetic threat test IP
        ];
        const isSuspiciousIp = Boolean(input.clientIp &&
            (SUSPICIOUS_IPS.includes(input.clientIp) || input.clientIp.startsWith('198.51.')));
        if (suspiciousIpRule?.enabled && isSuspiciousIp) {
            const points = suspiciousIpRule.weight;
            totalScore += points;
            triggeredRules.push({
                ruleId: suspiciousIpRule.ruleId,
                ruleName: suspiciousIpRule.name,
                pointsAdded: points,
                description: `IP address (${input.clientIp}) flagged in threat intelligence feeds (proxy/VPN/Tor node)`,
            });
            reasons.push(`Suspicious network address associated with anonymizing proxy or Tor exit node`);
        }
        // 5. Impossible Travel / Location Anomaly Check
        const locationRule = ruleMap.get('RULE_IMPOSSIBLE_TRAVEL');
        let locationAnomaly = false;
        if (customerPayments.length > 0 && input.location) {
            const lastPayment = customerPayments[customerPayments.length - 1];
            if (lastPayment.location && lastPayment.location !== input.location) {
                const timeDiffMinutes = (Date.now() - new Date(lastPayment.createdAt).getTime()) / (1000 * 60);
                // If locations differ drastically and occurred within 30 minutes
                if (timeDiffMinutes < 30) {
                    locationAnomaly = true;
                }
            }
        }
        if (locationRule?.enabled && locationAnomaly) {
            const points = locationRule.weight;
            totalScore += points;
            triggeredRules.push({
                ruleId: locationRule.ruleId,
                ruleName: locationRule.name,
                pointsAdded: points,
                description: `Impossible physical travel: rapid geographic shift detected within sub-hour window`,
            });
            reasons.push(`Impossible travel anomaly: physical location change defies realistic travel speed`);
        }
        // 6. Suspicious Merchant Reputation Check
        const merchantRule = ruleMap.get('RULE_SUSPICIOUS_MERCHANT');
        const merchant = store_1.dbStore.merchants.find((m) => m.id === input.merchantId);
        let merchantReputation = 85; // default trust score
        if (merchant) {
            merchantReputation = merchant.trustScore;
        }
        if (merchantRule?.enabled) {
            if (merchant && (merchant.status === 'SUSPENDED' || merchant.riskScore >= 70 || merchant.trustScore < 40)) {
                const points = merchantRule.weight;
                totalScore += points;
                triggeredRules.push({
                    ruleId: merchantRule.ruleId,
                    ruleName: merchantRule.name,
                    pointsAdded: points,
                    description: `Merchant (${merchant.name}) has elevated chargeback risk or past fraud complaints`,
                });
                reasons.push(`Merchant reputation alert: destination business has high dispute or complaint history`);
            }
        }
        // 7. Suspicious UPI or URL / Phishing Characteristic Check
        const urlRule = ruleMap.get('RULE_SUSPICIOUS_URL');
        let isSuspiciousUpiOrUrl = false;
        if (input.upiId) {
            const upiLower = input.upiId.toLowerCase();
            if (upiLower.includes('fraud') ||
                upiLower.includes('scam') ||
                upiLower.includes('refund-verify') ||
                upiLower.includes('kyc-update')) {
                isSuspiciousUpiOrUrl = true;
            }
        }
        if (input.paymentUrl) {
            const urlLower = input.paymentUrl.toLowerCase();
            if (urlLower.includes('free-bonus') ||
                urlLower.includes('verify-kyc') ||
                urlLower.includes('fake') ||
                urlLower.includes('.xyz') ||
                urlLower.includes('.top')) {
                isSuspiciousUpiOrUrl = true;
            }
        }
        if (urlRule?.enabled && isSuspiciousUpiOrUrl) {
            const points = urlRule.weight;
            totalScore += points;
            triggeredRules.push({
                ruleId: urlRule.ruleId,
                ruleName: urlRule.name,
                pointsAdded: points,
                description: `Payment identifier or referrer URL contains known phishing patterns or spoofing triggers`,
            });
            reasons.push(`Deceptive payment identifier: matches known scam campaign handles or phishing patterns`);
        }
        // Normalize final score between 0 and 100
        const clampedScore = Math.min(100, Math.max(0, totalScore));
        // Determine thresholds from store
        const { low, medium, high } = store_1.dbStore.thresholds;
        let riskLevel = 'LOW';
        let recommendation = 'ALLOW';
        if (clampedScore <= low) {
            riskLevel = 'LOW';
            recommendation = 'ALLOW';
        }
        else if (clampedScore <= medium) {
            riskLevel = 'MEDIUM';
            recommendation = 'MONITOR';
        }
        else if (clampedScore <= high) {
            riskLevel = 'HIGH';
            recommendation = 'REVIEW';
        }
        else {
            riskLevel = 'CRITICAL';
            recommendation = 'BLOCK';
        }
        if (reasons.length === 0) {
            reasons.push('Standard consumer transaction profile within normal behavioral baseline');
        }
        return {
            riskScore: clampedScore,
            riskLevel,
            recommendation,
            reasons,
            triggeredRules,
            features: {
                amountDeviation: amountRatio,
                velocityScore: velocityCount,
                isNewDevice,
                isSuspiciousIp,
                locationAnomaly,
                merchantReputation,
                urlEntropy: isSuspiciousUpiOrUrl ? 0.85 : 0.12,
            },
        };
    }
}
exports.FraudDetectionEngine = FraudDetectionEngine;
