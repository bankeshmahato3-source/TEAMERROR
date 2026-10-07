import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../models/store';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'payguard-super-secure-jwt-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    merchantId?: string;
    name: string;
  };
}

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: UserRole;
      merchantId?: string;
      name: string;
    };

    const user = dbStore.users.find((u) => u.id === decoded.id);
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
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid.' });
  }
};

export const requireRoles = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const generateToken = (payload: { id: string; email: string; role: UserRole; merchantId?: string; name: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
