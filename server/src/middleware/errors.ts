import multer from 'multer';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { AppError } from '../lib/AppError';
import type { AppRequest, AppResponse, NextFn } from '../types/http';

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === '23505'
  );
}

export function handleErrors(
  err: unknown,
  _req: AppRequest,
  res: AppResponse,
  _next: NextFn,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File too large. Maximum size is ${env.MAX_FILE_SIZE_MB}MB`
        : err.message;
    res.status(400).json({ success: false, message });
    return;
  }

  if (err instanceof Error && err.message === 'Only JPEG, PNG, and WebP images are allowed') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (isUniqueViolation(err)) {
    res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
    });
    return;
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : String(err),
  });
}
