import { env } from '../config/env';
import { AppError } from '../lib/AppError';
import { verifyToken } from '../lib/jwt';
import type { AppRequest, AppResponse, NextFn } from '../types/http';

export function requireAuth(req: AppRequest, _res: AppResponse, next: NextFn): void {
  const token = req.cookies?.[env.COOKIE_NAME];

  if (!token) {
    next(new AppError('Authentication required', 401));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
