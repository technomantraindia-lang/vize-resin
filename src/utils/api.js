// Centralized API configuration for VIZE Specialty Polymers
// Points to Railway production by default, or configurable via VITE_API_BASE_URL

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://vize-resin-production.up.railway.app'
).replace(/\/+$/, '');

const isLocalHost = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
};

// Lightweight in-memory response cache & request deduplicator
const apiCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function clearApiCache(endpointPrefix = null) {
  if (!endpointPrefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.includes(endpointPrefix)) {
      apiCache.delete(key);
    }
  }
}

/**
 * Robust API fetch helper that works seamlessly across local dev and live Railway backend.
 * In local dev, always uses the local Laravel backend (proxied via Vite on localhost:5173 or direct 127.0.0.1:8000)
 * so that any products/tables/workshops updated in the local Admin Dashboard are instantly reflected.
 * Features in-memory caching and request deduplication for 0ms transitions and zero UI fluctuation.
 */
export async function fetchFromApi(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();
  const isCacheable = method === 'GET' && !options.skipCache;

  // Invalidate cache on mutations
  if (method !== 'GET') {
    if (cleanEndpoint.includes('/orders') || cleanEndpoint.includes('/checkout')) {
      clearApiCache('/orders');
      clearApiCache('/customers');
    }
    if (cleanEndpoint.includes('/cart')) {
      clearApiCache('/cart');
    }
  }

  // 1. Check in-memory cache for GET requests
  if (isCacheable) {
    const cached = apiCache.get(cleanEndpoint);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    // Deduplicate in-flight concurrent requests to the exact same endpoint
    if (inFlightRequests.has(cleanEndpoint)) {
      return inFlightRequests.get(cleanEndpoint);
    }
  }

  const fetchPromise = (async () => {
    // If user explicitly configured a custom backend in .env, honor it directly
    if (import.meta.env.VITE_API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, options);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      if (isCacheable) apiCache.set(cleanEndpoint, { data: json, timestamp: Date.now() });
      return json;
    }

    // In local development, always query the local backend
    if (isLocalHost()) {
      // 1. Try Vite local proxy first (same-origin, zero CORS issues, instant response)
      try {
        const proxyRes = await fetch(cleanEndpoint, options);
        if (proxyRes.ok) {
          const json = await proxyRes.json();
          if (json && json.success !== false) {
            if (isCacheable) apiCache.set(cleanEndpoint, { data: json, timestamp: Date.now() });
            return json;
          }
        }
      } catch {
        // Proxy failed or not active, try direct local port 8000 below
      }

      // 2. Try direct local Laravel port 8000
      try {
        const localRes = await fetch(`http://127.0.0.1:8000${cleanEndpoint}`, options);
        if (localRes.ok) {
          const json = await localRes.json();
          if (json && json.success !== false) {
            if (isCacheable) apiCache.set(cleanEndpoint, { data: json, timestamp: Date.now() });
            return json;
          }
        }
      } catch (err) {
        console.warn(`Local backend unreachable for ${cleanEndpoint}:`, err);
      }
    }

    // In production (or if running outside localhost without .env), use Railway backend
    const liveRes = await fetch(`${API_BASE_URL}${cleanEndpoint}`, options);
    if (!liveRes.ok) {
      throw new Error(`HTTP error ${liveRes.status}`);
    }
    const json = await liveRes.json();
    if (isCacheable) apiCache.set(cleanEndpoint, { data: json, timestamp: Date.now() });
    return json;
  })();

  if (isCacheable) {
    inFlightRequests.set(cleanEndpoint, fetchPromise);
    try {
      return await fetchPromise;
    } finally {
      inFlightRequests.delete(cleanEndpoint);
    }
  }

  return await fetchPromise;
}

/**
 * Resolves image paths so that uploaded photos stored in /uploads/
 * are loaded from the local backend in local development, or Railway in production.
 */
export function resolveImageUrl(src) {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // Uploaded media files live on the backend server
  if (
    normalized.startsWith('/uploads/') ||
    normalized.startsWith('/colors/uploads/') ||
    normalized.includes('/uploads/')
  ) {
    if (isLocalHost()) {
      // Vite proxies /uploads and /colors/uploads directly to http://127.0.0.1:8000
      return normalized;
    }
    return `${API_BASE_URL}${normalized}`;
  }

  // Static bundled public assets (e.g. /colors/, /rasin-product/, /table top/, /logos/)
  // Safely decode first so we NEVER double-encode (%20 becoming %2520)
  try {
    return encodeURI(decodeURI(normalized));
  } catch {
    return encodeURI(normalized);
  }
}
