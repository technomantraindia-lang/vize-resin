// Centralized API configuration for VIZE Specialty Polymers
// Points to Railway production by default, or configurable via VITE_API_BASE_URL

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://vize-resin-production.up.railway.app'
).replace(/\/+$/, '');

/**
 * Robust API fetch helper that works seamlessly across local dev and live Railway backend.
 * In development, if local backend has the requested product/data, it uses local.
 * If local is offline or doesn't have the product (e.g. newly created in Railway Admin),
 * it automatically fetches from the live Railway backend!
 */
export async function fetchFromApi(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If user explicitly configured a custom backend in .env, honor it directly
  if (import.meta.env.VITE_API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, options);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  }

  // In local development, first check local server with a fast timeout
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const localRes = await fetch(`http://127.0.0.1:8000${cleanEndpoint}`, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (localRes.ok) {
        const json = await localRes.json();
        // If local backend returned successful data (and not product-not-found)
        if (json && json.success && json.data) {
          return json;
        }
      }
    } catch {
      // Local server is not running or timed out; fall through to live Railway backend
    }
  }

  // Fetch from live Railway backend
  const liveRes = await fetch(`${API_BASE_URL}${cleanEndpoint}`, options);
  if (!liveRes.ok) {
    throw new Error(`HTTP error ${liveRes.status}`);
  }
  return await liveRes.json();
}

/**
 * Resolves image paths so that uploaded photos stored in /uploads/
 * are loaded directly from the live Railway backend if not locally present.
 */
export function resolveImageUrl(src) {
  if (!src || typeof src !== 'string') return '/rasin-product/Vize%20PrimeX.png';
  const trimmed = src.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // Uploaded files live on the backend server (Railway / live production or configured API_BASE_URL)
  if (normalized.startsWith('/uploads/')) {
    return `${API_BASE_URL}${normalized}`;
  }

  // Static bundled public assets (e.g. /rasin-product/, /table top/, /logos/)
  return encodeURI(normalized);
}
