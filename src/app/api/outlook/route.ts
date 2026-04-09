import { NextRequest, NextResponse } from "next/server";

// Fetch emails from Outlook via Microsoft Graph API
export async function GET(request: NextRequest) {
  const token = request.cookies.get("microsoft_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated with Microsoft" }, { status: 401 });
  }

  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const headers = { Authorization: `Bearer ${token}` };

    // Paginate through all messages
    let allMessages: Record<string, unknown>[] = [];
    let nextLink: string | null =
      `https://graph.microsoft.com/v1.0/me/messages?$filter=receivedDateTime ge ${ninetyDaysAgo}&$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,bodyPreview,body,conversationId,hasAttachments&$top=100&$orderby=receivedDateTime desc`;

    while (nextLink && allMessages.length < 2000) {
      const res: Response = await fetch(nextLink, { headers });
      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      allMessages.push(...(data.value || []));
      nextLink = data["@odata.nextLink"] || null;
    }

    // Transform to unified format
    const emails = allMessages.map((msg: Record<string, unknown>) => {
      const from = msg.from as { emailAddress?: { name?: string; address?: string } } | undefined;
      const toRecipients = msg.toRecipients as { emailAddress?: { name?: string; address?: string } }[] | undefined;
      const ccRecipients = msg.ccRecipients as { emailAddress?: { name?: string; address?: string } }[] | undefined;
      const body = msg.body as { content?: string } | undefined;

      return {
        id: msg.id as string,
        from: from?.emailAddress
          ? `${from.emailAddress.name || ""} <${from.emailAddress.address || ""}>`
          : "",
        to: (toRecipients || [])
          .map((r) => `${r.emailAddress?.name || ""} <${r.emailAddress?.address || ""}>`)
          .join(", "),
        cc: (ccRecipients || [])
          .map((r) => `${r.emailAddress?.name || ""} <${r.emailAddress?.address || ""}>`)
          .join(", "),
        subject: (msg.subject as string) || "",
        date: (msg.receivedDateTime as string) || "",
        hasAttachments: (msg.hasAttachments as boolean) || false,
        bodyPreview: ((msg.bodyPreview as string) || "").slice(0, 200),
        body: (body?.content || "")
          .replace(/<[^>]*>/g, " ")    // strip HTML
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 600),
        threadId: (msg.conversationId as string) || (msg.id as string),
        conversationId: (msg.conversationId as string) || (msg.id as string),
      };
    });

    return NextResponse.json({
      emails,
      count: allMessages.length,
      totalFetched: emails.length,
    });
  } catch (error) {
    console.error("Outlook API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Outlook emails" },
      { status: 500 }
    );
  }
}
