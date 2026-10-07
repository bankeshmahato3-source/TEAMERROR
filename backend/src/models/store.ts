import fs from 'fs';
import path from 'path';
import {
  IUser,
  IMerchant,
  IOrder,
  IPayment,
  IFraudAnalysis,
  IFraudRule,
  IFraudAlert,
  IRefund,
  IApiKey,
  IWebhookEvent,
  ISecurityLog,
} from '../types';

interface DatabaseData {
  users: IUser[];
  merchants: IMerchant[];
  orders: IOrder[];
  payments: IPayment[];
  fraudAnalyses: IFraudAnalysis[];
  fraudRules: IFraudRule[];
  fraudAlerts: IFraudAlert[];
  refunds: IRefund[];
  apiKeys: IApiKey[];
  webhookEvents: IWebhookEvent[];
  securityLogs: ISecurityLog[];
  thresholds: {
    low: number;      // 0 - 29 (ALLOW)
    medium: number;   // 30 - 59 (MONITOR)
    high: number;     // 60 - 79 (REVIEW)
    critical: number; // 80 - 100 (BLOCK)
  };
}

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class MemoryStore {
  private data: DatabaseData = {
    users: [],
    merchants: [],
    orders: [],
    payments: [],
    fraudAnalyses: [],
    fraudRules: [],
    fraudAlerts: [],
    refunds: [],
    apiKeys: [],
    webhookEvents: [],
    securityLogs: [],
    thresholds: {
      low: 29,
      medium: 59,
      high: 79,
      critical: 80,
    },
  };

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[Store] Could not load persisted file, initializing fresh memory state.');
    }
  }

  public saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Error persisting database snapshot to disk:', err);
    }
  }

  // Users
  get users(): IUser[] { return this.data.users; }
  set users(u: IUser[]) { this.data.users = u; this.saveToDisk(); }

  // Merchants
  get merchants(): IMerchant[] { return this.data.merchants; }
  set merchants(m: IMerchant[]) { this.data.merchants = m; this.saveToDisk(); }

  // Orders
  get orders(): IOrder[] { return this.data.orders; }
  set orders(o: IOrder[]) { this.data.orders = o; this.saveToDisk(); }

  // Payments
  get payments(): IPayment[] { return this.data.payments; }
  set payments(p: IPayment[]) { this.data.payments = p; this.saveToDisk(); }

  // Fraud Analyses
  get fraudAnalyses(): IFraudAnalysis[] { return this.data.fraudAnalyses; }
  set fraudAnalyses(fa: IFraudAnalysis[]) { this.data.fraudAnalyses = fa; this.saveToDisk(); }

  // Fraud Rules
  get fraudRules(): IFraudRule[] { return this.data.fraudRules; }
  set fraudRules(fr: IFraudRule[]) { this.data.fraudRules = fr; this.saveToDisk(); }

  // Fraud Alerts
  get fraudAlerts(): IFraudAlert[] { return this.data.fraudAlerts; }
  set fraudAlerts(fa: IFraudAlert[]) { this.data.fraudAlerts = fa; this.saveToDisk(); }

  // Refunds
  get refunds(): IRefund[] { return this.data.refunds; }
  set refunds(r: IRefund[]) { this.data.refunds = r; this.saveToDisk(); }

  // ApiKeys
  get apiKeys(): IApiKey[] { return this.data.apiKeys; }
  set apiKeys(k: IApiKey[]) { this.data.apiKeys = k; this.saveToDisk(); }

  // WebhookEvents
  get webhookEvents(): IWebhookEvent[] { return this.data.webhookEvents; }
  set webhookEvents(w: IWebhookEvent[]) { this.data.webhookEvents = w; this.saveToDisk(); }

  // SecurityLogs
  get securityLogs(): ISecurityLog[] { return this.data.securityLogs; }
  set securityLogs(l: ISecurityLog[]) { this.data.securityLogs = l; this.saveToDisk(); }

  // Thresholds
  get thresholds() { return this.data.thresholds; }
  set thresholds(t) { this.data.thresholds = t; this.saveToDisk(); }

  // Reset or clear
  public reset() {
    this.data = {
      users: [],
      merchants: [],
      orders: [],
      payments: [],
      fraudAnalyses: [],
      fraudRules: [],
      fraudAlerts: [],
      refunds: [],
      apiKeys: [],
      webhookEvents: [],
      securityLogs: [],
      thresholds: {
        low: 29,
        medium: 59,
        high: 79,
        critical: 80,
      },
    };
    this.saveToDisk();
  }
}

export const dbStore = new MemoryStore();
