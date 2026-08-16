import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

const secret = () => process.env.JWT_SECRET || 'dev-secret-change-in-production';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), secret()) as { userId: number };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Same as requireAuth but doesn't block unauthenticated requests
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), secret()) as { userId: number };
      req.userId = payload.userId;
    } catch {
      // bad token — proceed anyway, userId stays undefined
    }
  }
  next();
}
