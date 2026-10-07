"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireRoles = exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store_1 = require("../models/store");
const JWT_SECRET = process.env.JWT_SECRET || 'payguard-super-secure-jwt-secret-key-2026';
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = store_1.dbStore.users.find((u) => u.id === decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid session or user not found.' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            merchantId: user.merchantId,
            name: user.name,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: 'Token expired or invalid.' });
    }
};
exports.authenticateJwt = authenticateJwt;
const requireRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: role '${req.user.role}' lacks permission for this action. Required: ${roles.join(', ')}`,
            });
        }
        next();
    };
};
exports.requireRoles = requireRoles;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
