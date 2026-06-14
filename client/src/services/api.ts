import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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

    if (error.response?.status === 401 && onUnauthorized && !isAuthEndpoint) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default api;
