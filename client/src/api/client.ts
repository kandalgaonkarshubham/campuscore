import axios from 'axios';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/errors';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
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
