import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/api/auth", "/api/seed", "/api/cron"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For API routes, check for auth cookie or header
  if (pathname.startsWith("/api/")) {
    // Allow if Supabase session cookie exists or auth header present
    const hasAuth =
      request.cookies.get("sb-access-token") ||
      request.cookies.get("gmail_access_token") ||
      request.cookies.get("nango_connection_id") ||
      request.headers.get("authorization");

    // For now, allow all API calls (we check auth inside each route)
    // In production, add stricter checks here
    return NextResponse.next();
  }

  // For pages, allow all (auth is checked client-side)
  // In production, redirect to /login if no session
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
