const BASE = "/api";

export async function api<T>(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    headers: { Accept: "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as T;
  return { data, headers: res.headers } as const;
}
