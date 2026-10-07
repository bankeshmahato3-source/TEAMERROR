export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'SECURITY_ANALYST' | 'ADMIN';

export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Wallet';

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'BLOCKED' | 'REVIEW' | 'REFUNDED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskAction = 'ALLOW' | 'MONITOR' | 'REVIEW' | 'BLOCK';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  merchantId?: string;
  avatar?: string;
  createdAt: string;
}

export interface IMerchant {
  id: string;
  name: string;
  email: string;
  category: string;
  website: string;
  status: 'ACTIVE' | 'SUSPENDED';
  riskScore: number;
  trustScore: number;
  securityScore: number;
  webhookUrl?: string;
  createdAt: string;
}

export interface IOrder {
  id: string;
  orderId: string;
  merchantId: string;
  merchantName?: string;
  merchantCategory?: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  status: 'created' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

export interface IPayment {
  id: string;
  paymentId: string;
  orderId: string;
  merchantId: string;
  merchantName: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  upiId?: string;
  cardLast4?: string;
  walletProvider?: string;
  bankName?: string;
  status: PaymentStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: RiskAction;
  reasons: string[];
  clientIp: string;
  device: string;
  browser: string;
  location: string;
  refundedAmount?: number;
  createdAt: string;
}

export interface IFraudAnalysis {
  id: string;
  paymentId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: RiskAction;
  reasons: string[];
  triggeredRules: Array<{
    ruleId: string;
    ruleName: string;
    pointsAdded: number;
    description: string;
  }>;
  features: {
    amountDeviation: number;
    velocityScore: number;
    isNewDevice: boolean;
    isSuspiciousIp: boolean;
    locationAnomaly: boolean;
    merchantReputation: number;
    urlEntropy?: number;
  };
  timeline: Array<{
    stage: string;
    timestamp: string;
    status: string;
    detail: string;
  }>;
  createdAt: string;
}

export interface IFraudRule {
  id: string;
  ruleId: string;
  name: string;
  category: 'TRANSACTION' | 'DEVICE' | 'NETWORK' | 'MERCHANT' | 'BEHAVIOR';
  weight: number;
  enabled: boolean;
  thresholdValue?: number;
  description: string;
}

export interface IFraudAlert {
  id: string;
  alertId: string;
  paymentId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  riskScore: number;
  severity: RiskLevel;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  message: string;
  createdAt: string;
}

export interface IRefund {
  id: string;
  refundId: string;
  paymentId: string;
  orderId: string;
  merchantId: string;
  amount: number;
  currency: string;
  reason: string;
  type: 'FULL' | 'PARTIAL';
  status: 'PROCESSED';
  createdAt: string;
}

export interface IApiKey {
  id: string;
  keyId: string;
  merchantId: string;
  name: string;
  keyPrefix: string;
  maskedKey: string;
  rawSecret?: string;
  environment: 'sandbox';
  revoked: boolean;
  lastUsed?: string;
  createdAt: string;
}

export interface IWebhookEvent {
  id: string;
  eventId: string;
  merchantId: string;
  eventType: string;
  payload: any;
  deliveryStatus: 'DELIVERED' | 'FAILED' | 'PENDING';
  attempts: number;
  responseCode?: number;
  createdAt: string;
}

export interface ISecurityLog {
  id: string;
  action: string;
  actorEmail: string;
  actorRole: string;
  ip: string;
  details: string;
  createdAt: string;
}
