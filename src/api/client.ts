const BASE = '/api';

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, data: unknown) =>
    apiRequest<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    apiRequest<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(path: string) =>
    apiRequest<T>(path, { method: 'DELETE' }),
};
