import { NextRequest, NextResponse } from "next/server";
import { nango } from "@/lib/nango";

type GmailMessage = {
  id: string;
  from: string;
  to: string;
  cc: string;
  subject: string;
  date: string;
  hasAttachments: boolean;
  bodyPreview: string;
  body: string;
  threadId: string;
  conversationId: string;
};

export async function GET(request: NextRequest) {
  const connectionId = request.nextUrl.searchParams.get("connectionId")
    || request.cookies.get("nango_connection_id")?.value;

  // Try Nango first, then fallback to cookie token
  let token: string | null = null;

  if (connectionId) {
    try {
      const t = await nango.getToken("google-mail", connectionId);
      token = typeof t === "string" ? t : String(t);
    } catch {
      // Nango not available
    }
  }

  // Fallback to old cookie method
  if (!token) {
    token = request.cookies.get("gmail_access_token")?.value || null;
  }

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const ninetyDaysAgo = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000);
    const query = `after:${ninetyDaysAgo} category:primary OR in:sent`;
    const headers = { Authorization: `Bearer ${token}` };

    // Paginate through all messages
    const allMessageIds: { id: string; threadId: string }[] = [];
    let pageToken: string | undefined;

    do {
      const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
      url.searchParams.set("maxResults", "500");
      url.searchParams.set("q", query);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const listRes = await fetch(url.toString(), { headers });
      const listData = await listRes.json();

      if (listData.messages) {
        allMessageIds.push(...listData.messages.map((m: { id: string; threadId: string }) => ({ id: m.id, threadId: m.threadId })));
      }
      pageToken = listData.nextPageToken;
    } while (pageToken);

    if (allMessageIds.length === 0) {
      return NextResponse.json({ emails: [], count: 0, totalFetched: 0 });
    }

    // Fetch in batches of 10
    const emails: GmailMessage[] = [];
    const BATCH_SIZE = 10;

    for (let i = 0; i < allMessageIds.length; i += BATCH_SIZE) {
      const batch = allMessageIds.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (msg) => {
          try {
            const msgRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
              { headers }
            );
            const msgData = await msgRes.json();

            const hdrs = msgData.payload?.headers || [];
            const getHeader = (name: string) =>
              hdrs.find((h: { name: string; value: string }) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

            const hasAttachments = (msgData.payload?.parts || []).some(
              (p: { filename?: string }) => p.filename && p.filename.length > 0
            );

            let body = "";
            const parts = msgData.payload?.parts || [];
            const textPart = parts.find((p: { mimeType: string }) => p.mimeType === "text/plain");
            if (textPart?.body?.data) {
              body = Buffer.from(textPart.body.data, "base64url").toString("utf-8");
            } else if (msgData.payload?.body?.data) {
              body = Buffer.from(msgData.payload.body.data, "base64url").toString("utf-8");
            }
            body = body.replace(/[-_=]{3,}/g, "").replace(/\n{3,}/g, "\n\n").replace(/>.*/g, "").trim().slice(0, 600);

            return {
              id: msg.id,
              from: getHeader("From"),
              to: getHeader("To"),
              cc: getHeader("Cc"),
              subject: getHeader("Subject"),
              date: getHeader("Date"),
              hasAttachments,
              bodyPreview: (msgData.snippet || "").slice(0, 200),
              body,
              threadId: msg.threadId,
              conversationId: msg.threadId,
            };
          } catch {
            return null;
          }
        })
      );

      emails.push(...batchResults.filter((e): e is GmailMessage => e !== null));
    }

    return NextResponse.json({
      emails,
      count: allMessageIds.length,
      totalFetched: emails.length,
    });
  } catch (error) {
    console.error("Gmail API error:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
