const API_ORIGIN = (import.meta.env.VITE_API_URL).replace(
  /\/api\/?$/,
  '',
);

export function resolveUploadUrl(photoUrl: string | null): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  return `${API_ORIGIN}${photoUrl}`;
}
