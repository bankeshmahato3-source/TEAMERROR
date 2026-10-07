"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoRoleSwitch = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const store_1 = require("../models/store");
const auth_1 = require("../middleware/auth");
const auditLogger_1 = require("../utils/auditLogger");
const register = async (req, res) => {
    try {
        const { name, email, password, role, merchantName, merchantCategory } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        }
        const existingUser = store_1.dbStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }
        const assignedRole = role || 'CUSTOMER';
        let merchantId = undefined;
        if (assignedRole === 'MERCHANT') {
            const newMerchantId = `merch_${Date.now()}`;
            merchantId = newMerchantId;
            store_1.dbStore.merchants = [
                ...store_1.dbStore.merchants,
                {
                    id: newMerchantId,
                    name: merchantName || `${name}'s Store`,
                    email,
                    category: merchantCategory || 'E-Commerce Retail',
                    website: `https://${(merchantName || name).toLowerCase().replace(/\s+/g, '')}.com`,
                    status: 'ACTIVE',
                    riskScore: 12,
                    trustScore: 88,
                    securityScore: 85,
                    createdAt: new Date().toISOString(),
                },
            ];
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = {
            id: `usr_${Date.now()}`,
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: assignedRole,
            merchantId,
            createdAt: new Date().toISOString(),
        };
        store_1.dbStore.users = [...store_1.dbStore.users, newUser];
        const token = (0, auth_1.generateToken)({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            merchantId: newUser.merchantId,
            name: newUser.name,
        });
        (0, auditLogger_1.logSecurityEvent)('USER_REGISTERED', newUser.email, newUser.role, `Registered as ${newUser.role}`);
        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                merchantId: newUser.merchantId,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const user = store_1.dbStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            (0, auditLogger_1.logSecurityEvent)('FAILED_LOGIN_ATTEMPT', email, user.role, 'Invalid password submitted');
            return res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
        }
        const token = (0, auth_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
            merchantId: user.merchantId,
            name: user.name,
        });
        (0, auditLogger_1.logSecurityEvent)('USER_LOGGED_IN', user.email, user.role, 'Successful login');
        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                merchantId: user.merchantId,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Login failed' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const user = store_1.dbStore.users.find((u) => u.id === req.user?.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                merchantId: user.merchantId,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Failed to retrieve profile' });
    }
};
exports.getMe = getMe;
// Fast Demo Role Switcher for presentation demos
const demoRoleSwitch = async (req, res) => {
    try {
        const { role } = req.body;
        const target = store_1.dbStore.users.find((u) => u.role === role);
        if (!target) {
            return res.status(404).json({ success: false, message: `No demo account found for role ${role}` });
        }
        const token = (0, auth_1.generateToken)({
            id: target.id,
            email: target.email,
            role: target.role,
            merchantId: target.merchantId,
            name: target.name,
        });
        return res.json({
            success: true,
            token,
            user: {
                id: target.id,
                name: target.name,
                email: target.email,
                role: target.role,
                merchantId: target.merchantId,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Demo switch failed' });
    }
};
exports.demoRoleSwitch = demoRoleSwitch;
