"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(__dirname, '../../data');
const DATA_FILE = path_1.default.join(DATA_DIR, 'store.json');
class MemoryStore {
    data = {
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
    loadFromDisk() {
        try {
            if (!fs_1.default.existsSync(DATA_DIR)) {
                fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
            }
            if (fs_1.default.existsSync(DATA_FILE)) {
                const raw = fs_1.default.readFileSync(DATA_FILE, 'utf-8');
                this.data = JSON.parse(raw);
            }
        }
        catch (err) {
            console.warn('[Store] Could not load persisted file, initializing fresh memory state.');
        }
    }
    saveToDisk() {
        try {
            if (!fs_1.default.existsSync(DATA_DIR)) {
                fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
            }
            fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('[Store] Error persisting database snapshot to disk:', err);
        }
    }
    // Users
    get users() { return this.data.users; }
    set users(u) { this.data.users = u; this.saveToDisk(); }
    // Merchants
    get merchants() { return this.data.merchants; }
    set merchants(m) { this.data.merchants = m; this.saveToDisk(); }
    // Orders
    get orders() { return this.data.orders; }
    set orders(o) { this.data.orders = o; this.saveToDisk(); }
    // Payments
    get payments() { return this.data.payments; }
    set payments(p) { this.data.payments = p; this.saveToDisk(); }
    // Fraud Analyses
    get fraudAnalyses() { return this.data.fraudAnalyses; }
    set fraudAnalyses(fa) { this.data.fraudAnalyses = fa; this.saveToDisk(); }
    // Fraud Rules
    get fraudRules() { return this.data.fraudRules; }
    set fraudRules(fr) { this.data.fraudRules = fr; this.saveToDisk(); }
    // Fraud Alerts
    get fraudAlerts() { return this.data.fraudAlerts; }
    set fraudAlerts(fa) { this.data.fraudAlerts = fa; this.saveToDisk(); }
    // Refunds
    get refunds() { return this.data.refunds; }
    set refunds(r) { this.data.refunds = r; this.saveToDisk(); }
    // ApiKeys
    get apiKeys() { return this.data.apiKeys; }
    set apiKeys(k) { this.data.apiKeys = k; this.saveToDisk(); }
    // WebhookEvents
    get webhookEvents() { return this.data.webhookEvents; }
    set webhookEvents(w) { this.data.webhookEvents = w; this.saveToDisk(); }
    // SecurityLogs
    get securityLogs() { return this.data.securityLogs; }
    set securityLogs(l) { this.data.securityLogs = l; this.saveToDisk(); }
    // Thresholds
    get thresholds() { return this.data.thresholds; }
    set thresholds(t) { this.data.thresholds = t; this.saveToDisk(); }
    // Reset or clear
    reset() {
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
exports.dbStore = new MemoryStore();
