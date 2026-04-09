import { NextRequest, NextResponse } from "next/server";

// Step 2: Exchange code for access token, then redirect to discovery
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/discovery?error=no_code", request.url));
  }

  // Exchange authorization code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokens.access_token) {
    return NextResponse.redirect(new URL("/discovery?error=token_failed", request.url));
  }

  // Store token in a cookie (simple approach for MVP)
  const response = NextResponse.redirect(
    new URL("/discovery?connected=gmail", request.url)
  );

  response.cookies.set("gmail_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // localhost
    sameSite: "lax" as const,
      maxAge: 3600, // 1 hour
    path: "/",
  });

  if (tokens.refresh_token) {
    response.cookies.set("gmail_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return response;
}
