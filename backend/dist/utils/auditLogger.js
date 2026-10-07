"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSecurityEvent = void 0;
const store_1 = require("../models/store");
const logSecurityEvent = (action, actorEmail, actorRole, details, ip = '127.0.0.1') => {
    const log = {
        id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        action,
        actorEmail,
        actorRole,
        ip,
        details,
        createdAt: new Date().toISOString(),
    };
    store_1.dbStore.securityLogs = [log, ...store_1.dbStore.securityLogs];
};
exports.logSecurityEvent = logSecurityEvent;
