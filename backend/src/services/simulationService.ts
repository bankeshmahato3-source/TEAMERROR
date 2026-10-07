import { dbStore } from '../models/store';
import { FraudDetectionEngine } from './fraudEngine';
import { IPayment, IFraudAnalysis, IFraudAlert } from '../types';

export class FraudSimulationService {
  /**
   * Generates a batch of distinct, realistic simulated scenarios
   * and runs them through the full fraud detection engine pipeline.
   */
  public static async runSimulation(): Promise<{
    simulatedScenarios: Array<{
      scenarioName: string;
      description: string;
      payment: IPayment;
      analysis: IFraudAnalysis;
      alert?: IFraudAlert;
    }>;
  }> {
    const timestamp = new Date().toISOString();
    const results: Array<{
      scenarioName: string;
      description: string;
      payment: IPayment;
      analysis: IFraudAnalysis;
      alert?: IFraudAlert;
    }> = [];

    // Define 6 comprehensive attack & normal test scenarios
    const scenarios = [
      {
        name: 'Normal Verified Consumer Purchase',
        description: 'Standard coffee shop transaction from recognized MacBook device and residential ISP.',
        amount: 349,
        merchantId: 'merch_01',
        merchantName: 'TechGizmo Store',
        customerName: 'Rahul Verma',
        customerEmail: 'rahul.verma@example.com',
        method: 'UPI' as const,
        upiId: 'rahul@okhdfcbank',
        clientIp: '157.34.120.45',
        device: 'MacBook Pro 16" (macOS 14)',
        browser: 'Chrome 122.0',
        location: 'Bengaluru, India',
        paymentUrl: 'https://techgizmo.in/checkout',
      },
      {
        name: 'Sudden High-Value Spike Anomaly',
        description: 'Single purchase 7.8× higher than customer historical baseline with no prior ticket history.',
        amount: 89999,
        merchantId: 'merch_02',
        merchantName: 'UrbanStyle Luxury',
        customerName: 'Ananya Sharma',
        customerEmail: 'ananya.s@example.com',
        method: 'Card' as const,
        cardLast4: '4111',
        clientIp: '122.161.49.20',
        device: 'Windows 11 PC',
        browser: 'Edge 121.0',
        location: 'New Delhi, India',
        paymentUrl: 'https://urbanstyle.co/pay',
      },
      {
        name: 'Rapid Velocity Brute-Force Bot Attempt',
        description: 'Automated script triggering 6 consecutive payment attempts in 40 seconds across multiple identities.',
        amount: 4500,
        merchantId: 'merch_03',
        merchantName: 'CloudNode Hosting',
        customerName: 'Unknown Card Tester',
        customerEmail: 'bot_attack_91@tempmail.io',
        method: 'Card' as const,
        cardLast4: '5500',
        clientIp: '198.51.100.42',
        device: 'Headless Linux (Puppeteer)',
        browser: 'Chromium Headless',
        location: 'Frankfurt, Germany',
        paymentUrl: 'https://cloudnode.io/checkout',
      },
      {
        name: 'Impossible Physical Travel Anomaly',
        description: 'Customer authenticated in Mumbai, followed by a transaction in London 4 minutes later.',
        amount: 14200,
        merchantId: 'merch_04',
        merchantName: 'AeroPass Flights',
        customerName: 'Vikram Seth',
        customerEmail: 'vikram.seth@example.com',
        method: 'Net Banking' as const,
        bankName: 'HDFC Bank',
        clientIp: '185.220.101.5', // Tor exit node
        device: 'Unknown Linux Device',
        browser: 'Firefox 120.0',
        location: 'London, UK (Previous: Mumbai)',
        paymentUrl: 'https://aeropass.com/book',
      },
      {
        name: 'Flagged Merchant Network Risk',
        description: 'Transaction directed toward a high-risk merchant with multiple prior chargeback disputes.',
        amount: 18500,
        merchantId: 'merch_suspicious_01',
        merchantName: 'Apex QuickLoans Direct',
        customerName: 'Deepak Rao',
        customerEmail: 'deepak.rao@example.com',
        method: 'UPI' as const,
        upiId: 'fraud@payguard',
        clientIp: '103.151.124.9',
        device: 'Redmi Note 12 (Android 13)',
        browser: 'Mi Browser',
        location: 'Surat, India',
        paymentUrl: 'https://apexloans-instant.xyz/pay',
      },
      {
        name: 'Deceptive Phishing Link Redirection Trap',
        description: 'Payment initiated from a typosquatted domain containing fake KYC urgency parameters.',
        amount: 25000,
        merchantId: 'merch_suspicious_02',
        merchantName: 'QuickRefund Support Gateway',
        customerName: 'Priya Nambiar',
        customerEmail: 'priya.n@example.com',
        method: 'UPI' as const,
        upiId: 'customer-care-help@payguard',
        clientIp: '45.154.255.89',
        device: 'Samsung Galaxy S22',
        browser: 'Chrome Mobile 121',
        location: 'Jaipur, India',
        paymentUrl: 'https://paytm-refund-verify-kyc.xyz/claim',
      },
    ];

    for (let i = 0; i < scenarios.length; i++) {
      const sc = scenarios[i];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const paymentId = `pay_SIM_${Date.now().toString().slice(-4)}_${randomSuffix}`;
      const orderId = `order_SIM_${randomSuffix}`;

      // Run through fraud engine
      const evalResult = FraudDetectionEngine.analyze({
        amount: sc.amount,
        merchantId: sc.merchantId,
        customerEmail: sc.customerEmail,
        clientIp: sc.clientIp,
        device: sc.device,
        location: sc.location,
        upiId: sc.upiId,
        paymentUrl: sc.paymentUrl,
      });

      let status: IPayment['status'] = 'SUCCESS';
      if (evalResult.recommendation === 'BLOCK') {
        status = 'BLOCKED';
      } else if (evalResult.recommendation === 'REVIEW') {
        status = 'REVIEW';
      } else if (evalResult.recommendation === 'MONITOR') {
        status = 'SUCCESS';
      }

      const payment: IPayment = {
        id: `p_sim_${randomSuffix}`,
        paymentId,
        orderId,
        merchantId: sc.merchantId,
        merchantName: sc.merchantName,
        customerName: sc.customerName,
        customerEmail: sc.customerEmail,
        amount: sc.amount,
        currency: 'INR',
        method: sc.method,
        upiId: sc.upiId,
        cardLast4: sc.cardLast4,
        bankName: sc.bankName,
        status,
        riskScore: evalResult.riskScore,
        riskLevel: evalResult.riskLevel,
        recommendation: evalResult.recommendation,
        reasons: evalResult.reasons,
        clientIp: sc.clientIp,
        device: sc.device,
        browser: sc.browser,
        location: sc.location,
        createdAt: timestamp,
      };

      const analysis: IFraudAnalysis = {
        id: `fa_sim_${randomSuffix}`,
        paymentId,
        riskScore: evalResult.riskScore,
        riskLevel: evalResult.riskLevel,
        recommendation: evalResult.recommendation,
        reasons: evalResult.reasons,
        triggeredRules: evalResult.triggeredRules,
        features: evalResult.features,
        timeline: [
          {
            stage: 'Order Initialization',
            timestamp: new Date(Date.now() - 3000).toISOString(),
            status: 'COMPLETED',
            detail: `Checkout initiated for ₹${sc.amount.toLocaleString()} with merchant ${sc.merchantName}`,
          },
          {
            stage: 'Device & Network Telemetry',
            timestamp: new Date(Date.now() - 2000).toISOString(),
            status: 'COMPLETED',
            detail: `Client IP ${sc.clientIp} resolved to ${sc.location} via ${sc.device}`,
          },
          {
            stage: 'Fraud Rules Engine Execution',
            timestamp: new Date(Date.now() - 1000).toISOString(),
            status: 'COMPLETED',
            detail: `Evaluated ${dbStore.fraudRules.length} rules. Triggered ${evalResult.triggeredRules.length} rules with aggregate score ${evalResult.riskScore}/100`,
          },
          {
            stage: 'Gatekeeper Decision',
            timestamp,
            status: status === 'BLOCKED' ? 'BLOCKED' : status === 'REVIEW' ? 'FLAGGED_REVIEW' : 'AUTHORIZED',
            detail: `Engine recommendation: ${evalResult.recommendation}. Payment state finalized as ${status}.`,
          },
        ],
        createdAt: timestamp,
      };

      let alert: IFraudAlert | undefined = undefined;
      if (evalResult.riskLevel === 'HIGH' || evalResult.riskLevel === 'CRITICAL') {
        alert = {
          id: `alert_sim_${randomSuffix}`,
          alertId: `alt_${randomSuffix}`,
          paymentId,
          merchantId: sc.merchantId,
          merchantName: sc.merchantName,
          amount: sc.amount,
          riskScore: evalResult.riskScore,
          severity: evalResult.riskLevel,
          status: 'OPEN',
          message: `Simulated anomaly triggered: ${evalResult.reasons[0] || 'Multiple risk signals detected'}`,
          createdAt: timestamp,
        };
      }

      // Add to store
      const currentPayments = [payment, ...dbStore.payments];
      const currentAnalyses = [analysis, ...dbStore.fraudAnalyses];
      dbStore.payments = currentPayments;
      dbStore.fraudAnalyses = currentAnalyses;

      if (alert) {
        dbStore.fraudAlerts = [alert, ...dbStore.fraudAlerts];
      }

      results.push({
        scenarioName: sc.name,
        description: sc.description,
        payment,
        analysis,
        alert,
      });
    }

    // Persist
    dbStore.saveToDisk();

    return {
      simulatedScenarios: results,
    };
  }
}
