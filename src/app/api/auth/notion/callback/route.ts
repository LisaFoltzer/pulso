import { NextRequest, NextResponse } from "next/server";

// Exchange Notion auth code for access token
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/discovery?error=no_code", request.url));
  }

  const credentials = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");

  const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NOTION_REDIRECT_URI || "http://localhost:3000/api/auth/notion/callback",
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokens.access_token) {
    return NextResponse.redirect(new URL("/discovery?error=notion_token_failed", request.url));
  }

  const response = NextResponse.redirect(
    new URL("/discovery?connected=notion", request.url)
  );

  response.cookies.set("notion_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
