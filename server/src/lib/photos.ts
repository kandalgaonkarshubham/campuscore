import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { del, put } from '@vercel/blob';
import { env } from '../config/env';

function getUploadDir(): string {
  return path.resolve(process.cwd(), env.UPLOAD_DIR);
}

function toLocalPhotoPath(filename: string): string {
  return `/uploads/${filename}`;
}

function generateFilename(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase();
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
}

function useBlobStorage(): boolean {
  return env.UPLOAD_STORAGE === 'vercel-blob';
}

export function isLocalUploadStorage(): boolean {
  return !useBlobStorage();
}

export async function storeUploadedPhoto(file: Express.Multer.File): Promise<string> {
  if (useBlobStorage()) {
    const pathname = `students/${generateFilename(file.originalname)}`;
    const blob = await put(pathname, file.buffer, {
      access: 'public',
      token: env.BLOB_READ_WRITE_TOKEN,
      contentType: file.mimetype,
    });
    return blob.url;
  }

  const filename = generateFilename(file.originalname);
  const uploadDir = getUploadDir();

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
  return toLocalPhotoPath(filename);
}

export async function removeStoredPhoto(photoUrl: string | null): Promise<void> {
  if (!photoUrl) return;

  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    if (!env.BLOB_READ_WRITE_TOKEN) return;

    try {
      await del(photoUrl, { token: env.BLOB_READ_WRITE_TOKEN });
    } catch (err) {
      console.error('Failed to delete blob photo:', err);
    }
    return;
  }

  const filePath = path.join(getUploadDir(), path.basename(photoUrl));
  if (!fs.existsSync(filePath)) return;

  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Failed to delete local photo:', err);
  }
}
