import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { env } from '../config/env';
import { db } from '../db';
import { adminUsers } from '../db/schema';
import { AppError } from '../lib/AppError';
import { authCookieOptions } from '../lib/cookies';
import { signToken } from '../lib/jwt';
import { loginSchema } from '../validators/auth';

export async function login(req: Request, res: Response): Promise<void> {
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

export function logout(_req: Request, res: Response): void {
  const { maxAge: _maxAge, ...clearOptions } = authCookieOptions();
  res.clearCookie(env.COOKIE_NAME, clearOptions);

  res.json({
    success: true,
    message: 'Logged out',
  });
}

export function me(req: Request, res: Response): void {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  res.json({
    success: true,
    message: 'OK',
    data: { username: req.user.username },
  });
}
