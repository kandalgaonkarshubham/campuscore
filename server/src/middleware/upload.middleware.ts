import multer, { type FileFilterCallback } from 'multer';
import type { Request } from 'express';
import { env } from '../config/env';

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function imageFileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (ALLOWED_MIMES.has(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
}

// Memory storage so the same upload flow works for local disk and Vercel Blob.
export const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: imageFileFilter,
}).single('photo');
