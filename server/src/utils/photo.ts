import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export function getUploadDir(): string {
  return path.resolve(process.cwd(), env.UPLOAD_DIR);
}

export function toPhotoUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export function photoPathFromUrl(photoUrl: string | null): string | null {
  if (!photoUrl) return null;
  const filename = path.basename(photoUrl);
  return path.join(getUploadDir(), filename);
}

export function deletePhotoFile(photoUrl: string | null): void {
  const filePath = photoPathFromUrl(photoUrl);
  if (!filePath || !fs.existsSync(filePath)) return;

  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Failed to delete photo file:', err);
  }
}
