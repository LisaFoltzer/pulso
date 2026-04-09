import { NextResponse } from "next/server";

// Microsoft OAuth — works for both Outlook and Teams
export async function GET() {
  const clientId = process.env.AZURE_CLIENT_ID;
  const tenantId = process.env.AZURE_TENANT_ID || "common";
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI || "http://localhost:3000/api/auth/microsoft/callback";

  if (!clientId) {
    return NextResponse.json(
      { error: "AZURE_CLIENT_ID not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  const scopes = [
    "openid",
    "profile",
    "email",
    "offline_access",
    "Mail.Read",           // Outlook emails
    "Calendars.Read",      // Calendar events
    "ChannelMessage.Read.All", // Teams channel messages
    "Chat.Read",           // Teams chats
    "OnlineMeetings.Read", // Teams meetings
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    response_mode: "query",
  });

  return NextResponse.redirect(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`
  );
}
