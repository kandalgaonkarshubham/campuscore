import { env } from '../config/env';
import { jwtExpiryToMs } from './jwt';

export function authCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'none';
  maxAge: number;
  path: string;
} {
  const isProduction = env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: jwtExpiryToMs(env.JWT_EXPIRES_IN),
    path: '/',
  };
}
