import type { CookieOptions } from 'express';
import { env } from '../config/env';
import { jwtExpiryToMs } from './jwt';

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: jwtExpiryToMs(env.JWT_EXPIRES_IN),
    path: '/',
  };
}
