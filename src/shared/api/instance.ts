import axios from 'axios';

function getApiOrigin(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.replace(/\/$/, '');
  }
  // Dev server works without .env; production build must set VITE_API_URL (no localhost in bundle).
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }
  throw new Error(
    'VITE_API_URL is not set. Set it for production builds (see frontend/.env.example).',
  );
}

const apiOrigin = getApiOrigin();

export const API_BASE_URL = apiOrigin;

export const api = axios.create({
  baseURL: `${apiOrigin}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
