// API_BASE_URL is taken directly from EXPO_PUBLIC_API_URL.
// The env var must already include the /api/v1 prefix — do NOT add it here.
//
// iOS Simulator  → http://localhost:3000/api/v1        (default below)
// Physical device → http://192.168.x.x:3000/api/v1    (set in .env)
const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1').replace(/\/$/, '');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client':     'vedarogya-mobile',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    throw new Error(errorBody.message ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}
