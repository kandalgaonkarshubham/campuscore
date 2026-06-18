import { env } from '../config/env';
import { jwtExpiryToMs } from './jwt';

export function authCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  maxAge: number;
  path: string;
} {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: jwtExpiryToMs(env.JWT_EXPIRES_IN),
    path: '/',
  };
}
