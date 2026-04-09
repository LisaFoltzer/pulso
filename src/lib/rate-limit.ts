// Simple in-memory rate limiter
// In production, use Redis via Vercel KV for distributed rate limiting

const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

// Get IP from request headers
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requests) {
    if (now > entry.resetAt) requests.delete(key);
  }
}, 60_000);
