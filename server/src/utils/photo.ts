import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export function getUploadDir(): string {
  return path.resolve(process.cwd(), env.UPLOAD_DIR);
}

export function toPhotoUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export function deleteLocalPhotoFile(photoUrl: string | null): void {
  if (!photoUrl || photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) return;

  const filePath = path.join(getUploadDir(), path.basename(photoUrl));
  if (!fs.existsSync(filePath)) return;

  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Failed to delete photo file:', err);
  }
}
