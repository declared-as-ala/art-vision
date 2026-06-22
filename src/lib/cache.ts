// Tiny in-memory TTL cache to avoid re-querying rarely-changing data (site
// settings, redirects, SEO) from the database on every request. Per-instance;
// good enough to collapse repeated round-trips on a warm serverless function.
const store = new Map<string, { value: unknown; expires: number }>();

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  const value = await fn();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}
