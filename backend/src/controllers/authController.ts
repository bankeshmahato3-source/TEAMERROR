import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStore } from '../models/store';
import { generateToken, AuthenticatedRequest } from '../middleware/auth';
import { logSecurityEvent } from '../utils/auditLogger';
import { UserRole } from '../types';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, merchantName, merchantCategory } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = dbStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const assignedRole: UserRole = role || 'CUSTOMER';
    let merchantId: string | undefined = undefined;

    if (assignedRole === 'MERCHANT') {
      const newMerchantId = `merch_${Date.now()}`;
      merchantId = newMerchantId;
      dbStore.merchants = [
        ...dbStore.merchants,
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

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      merchantId,
      createdAt: new Date().toISOString(),
    };

    dbStore.users = [...dbStore.users, newUser];

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      merchantId: newUser.merchantId,
      name: newUser.name,
    });

    logSecurityEvent('USER_REGISTERED', newUser.email, newUser.role, `Registered as ${newUser.role}`);

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = dbStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logSecurityEvent('FAILED_LOGIN_ATTEMPT', email, user.role, 'Invalid password submitted');
      return res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      merchantId: user.merchantId,
      name: user.name,
    });

    logSecurityEvent('USER_LOGGED_IN', user.email, user.role, 'Successful login');

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = dbStore.users.find((u) => u.id === req.user?.id);
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to retrieve profile' });
  }
};

// Fast Demo Role Switcher for presentation demos
export const demoRoleSwitch = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const target = dbStore.users.find((u) => u.role === role);
    if (!target) {
      return res.status(404).json({ success: false, message: `No demo account found for role ${role}` });
    }

    const token = generateToken({
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Demo switch failed' });
  }
};
