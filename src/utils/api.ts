/**
 * Safe API fetch helper for LearnX.
 * Automatically retries on transient startup/network glitches, parses JSON safely,
 * and handles failures gracefully without crashing or flooding console errors.
 */

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  retries = 3,
  delayMs = 400
): Promise<T | null> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('learnx_token') : null;
  const headers = new Headers(options?.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const mergedOptions = { ...options, headers };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, mergedOptions);
      if (!res.ok) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
          continue;
        }
        return null;
      }
      const data = await res.json();
      return data as T;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      // Silently return null after all retries have been exhausted
      return null;
    }
  }
  return null;
}
