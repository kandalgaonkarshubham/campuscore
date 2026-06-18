import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  sub: number;
  username: string;
}

export function signToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token');
  }

  const { sub, username } = decoded;
  if (typeof sub !== 'number' || typeof username !== 'string') {
    throw new Error('Invalid token');
  }

  return { sub, username };
}

const EXPIRY_MULTIPLIERS: Record<string, number> = {
  d: 86_400_000,
  h: 3_600_000,
  m: 60_000,
  s: 1_000,
};

export function jwtExpiryToMs(expiry: string): number {
  const match = expiry.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 86_400_000;

  const value = Number(match[1]);
  const unit = match[2];
  return value * (EXPIRY_MULTIPLIERS[unit] ?? 86_400_000);
}
