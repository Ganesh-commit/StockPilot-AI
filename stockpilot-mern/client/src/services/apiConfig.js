// Centralized API Base URL configuration for StockPilot AI
const DEPLOYED_BACKEND_URL = 'https://stockpilot-ai-ui9o.onrender.com';

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // When running in production (e.g. deployed on Vercel), default to the deployed backend on Render
  if (import.meta.env.PROD) {
    return DEPLOYED_BACKEND_URL;
  }
  // In local development, use relative path which is proxied by Vite dev server
  return '';
};

export const buildApiUrl = (endpoint) => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
};
