import { NextRequest, NextResponse } from "next/server";

// Fetch calls from Aircall API
export async function GET(request: NextRequest) {
  const credentials = request.cookies.get("aircall_credentials")?.value;

  if (!credentials) {
    return NextResponse.json({ error: "Not authenticated with Aircall" }, { status: 401 });
  }

  try {
    const headers = { Authorization: `Basic ${credentials}` };
    const ninetyDaysAgo = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000);

    // Paginate through calls
    const allCalls: Record<string, unknown>[] = [];
    let page = 1;

    while (allCalls.length < 1000) {
      const res = await fetch(
        `https://api.aircall.io/v1/calls?from=${ninetyDaysAgo}&per_page=50&page=${page}&order=desc`,
        { headers }
      );
      const data = await res.json();

      if (!data.calls || data.calls.length === 0) break;
      allCalls.push(...data.calls);

      if (!data.meta?.next_page_link) break;
      page++;
    }

    // Transform to unified format
    const events = allCalls.map((call: Record<string, unknown>) => {
      const user = call.user as { name?: string } | undefined;
      const contact = call.contact as { first_name?: string; last_name?: string; company_name?: string } | undefined;

      const callerName = user?.name || "Unknown";
      const contactName = contact
        ? `${contact.first_name || ""} ${contact.last_name || ""} ${contact.company_name ? `(${contact.company_name})` : ""}`.trim()
        : "Unknown";

      const direction = call.direction as string;
      const from = direction === "outbound" ? callerName : contactName;
      const to = direction === "outbound" ? contactName : callerName;

      return {
        id: call.id,
        from,
        to,
        cc: "",
        subject: `Appel ${direction === "outbound" ? "sortant" : "entrant"} — ${((call.duration as number) || 0)}s`,
        date: new Date(((call.started_at as number) || 0) * 1000).toISOString(),
        hasAttachments: false,
        bodyPreview: `Durée: ${Math.round(((call.duration as number) || 0) / 60)}min | Statut: ${call.status || "unknown"}`,
        body: [
          `Type: Appel ${direction}`,
          `Durée: ${Math.round(((call.duration as number) || 0) / 60)} minutes`,
          `Statut: ${call.status}`,
          call.recording ? "Enregistrement disponible" : "",
          (call.tags as { name: string }[] | undefined)?.map((t) => t.name).join(", ") || "",
        ].filter(Boolean).join("\n"),
        threadId: `aircall-${call.id}`,
        conversationId: `aircall-${contact ? `${contact.first_name}-${contact.last_name}` : call.id}`,
        source: "aircall",
      };
    });

    return NextResponse.json({
      events,
      count: allCalls.length,
    });
  } catch (error) {
    console.error("Aircall API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Aircall calls" },
      { status: 500 }
    );
  }
}
