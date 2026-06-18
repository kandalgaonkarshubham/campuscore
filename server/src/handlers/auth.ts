import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { env } from '../config/env';
import { db } from '../db';
import { adminUsers } from '../db/schema';
import { AppError } from '../lib/AppError';
import { authCookieOptions } from '../lib/cookies';
import { signToken } from '../lib/jwt';
import { loginSchema } from '../validators/auth';
import type { AppRequest, AppResponse } from '../types/http';

export async function login(req: AppRequest, res: AppResponse): Promise<void> {
  const { username, password } = loginSchema.parse(req.body);

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  if (!admin) {
    throw new AppError('Invalid username or password', 401);
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    throw new AppError('Invalid username or password', 401);
  }

  const token = signToken({ sub: admin.id, username: admin.username });
  res.cookie(env.COOKIE_NAME, token, authCookieOptions());

  res.json({
    success: true,
    message: 'Logged in',
    data: { username: admin.username },
  });
}

export function logout(_req: AppRequest, res: AppResponse): void {
  const clearOptions = authCookieOptions();
  res.clearCookie(env.COOKIE_NAME, { ...clearOptions, maxAge: undefined });

  res.json({
    success: true,
    message: 'Logged out',
  });
}

export function me(req: AppRequest, res: AppResponse): void {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  res.json({
    success: true,
    message: 'OK',
    data: { username: req.user.username },
  });
}
