export function resolveUploadUrl(photoUrl: string | null): string | null {
  if (!photoUrl) return null;
  // Blob URLs and any absolute URL are used as-is
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiOrigin = apiUrl.replace(/\/api\/?$/, '');
  return `${apiOrigin}${photoUrl}`;
}
