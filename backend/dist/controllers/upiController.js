"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpiOrLink = void 0;
const upiScanner_1 = require("../services/upiScanner");
const auditLogger_1 = require("../utils/auditLogger");
const checkUpiOrLink = async (req, res) => {
    try {
        const { target } = req.body;
        if (!target || typeof target !== 'string' || target.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide a valid payment link or UPI identifier to analyze.' });
        }
        const result = upiScanner_1.UpiScannerService.analyze(target);
        (0, auditLogger_1.logSecurityEvent)('UPI_SCAM_CHECK', 'guest@payguard.io', 'USER', `Checked target "${target.substring(0, 40)}" - Score: ${result.riskScore}/100 [${result.riskLevel}]`);
        return res.json({
            success: true,
            result,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Scam scan failed' });
    }
};
exports.checkUpiOrLink = checkUpiOrLink;
