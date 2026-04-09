import { NextResponse } from "next/server";

// Notion OAuth
export async function GET() {
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = process.env.NOTION_REDIRECT_URI || "http://localhost:3000/api/auth/notion/callback";

  if (!clientId) {
    return NextResponse.json(
      { error: "NOTION_CLIENT_ID not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    owner: "user",
  });

  return NextResponse.redirect(
    `https://api.notion.com/v1/oauth/authorize?${params.toString()}`
  );
}
