import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { AppError } from '../lib/AppError';
import type { JsonResponse } from '../types/http';

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
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const response = res as unknown as JsonResponse;

  if (err instanceof AppError) {
    response.status(err.statusCode).json({
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
    response.status(400).json({ success: false, message });
    return;
  }

  if (err instanceof Error && err.message === 'Only JPEG, PNG, and WebP images are allowed') {
    response.status(400).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    response.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (isUniqueViolation(err)) {
    response.status(409).json({
      success: false,
      message: 'A record with this value already exists',
    });
    return;
  }

  console.error(err);

  response.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : String(err),
  });
}
