import axios from 'axios';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/errors';

function normalizeUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

const api = axios.create({
  baseURL: normalizeUrl(import.meta.env.VITE_API_URL),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? '';
    const isAuthEndpoint = url.includes('/auth/me') || url.includes('/auth/login');
    const status = error.response?.status;

    if (status === 401 && onUnauthorized && !isAuthEndpoint) {
      onUnauthorized();
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    } else if (status && status >= 500) {
      toast.error(getErrorMessage(error, 'Server error. Please try again.'));
    }

    return Promise.reject(error);
  },
);

export default api;
