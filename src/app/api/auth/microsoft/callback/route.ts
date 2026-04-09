import { NextRequest, NextResponse } from "next/server";

// Exchange Microsoft auth code for tokens
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tenantId = process.env.AZURE_TENANT_ID || "common";

  if (!code) {
    return NextResponse.redirect(new URL("/discovery?error=no_code", request.url));
  }

  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET!,
        redirect_uri: process.env.MICROSOFT_REDIRECT_URI || "http://localhost:3000/api/auth/microsoft/callback",
        grant_type: "authorization_code",
      }),
    }
  );

  const tokens = await tokenResponse.json();

  if (!tokens.access_token) {
    return NextResponse.redirect(new URL("/discovery?error=microsoft_token_failed", request.url));
  }

  const response = NextResponse.redirect(
    new URL("/discovery?connected=microsoft", request.url)
  );

  response.cookies.set("microsoft_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
      maxAge: 3600,
    path: "/",
  });

  if (tokens.refresh_token) {
    response.cookies.set("microsoft_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}
