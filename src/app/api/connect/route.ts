import { NextRequest, NextResponse } from "next/server";
import { nango } from "@/lib/nango";

// Get Nango connection status for a user
export async function GET(request: NextRequest) {
  const connectionId = request.nextUrl.searchParams.get("connectionId");
  const integration = request.nextUrl.searchParams.get("integration") || "google-mail";

  if (!connectionId) {
    return NextResponse.json({ error: "connectionId required" }, { status: 400 });
  }

  try {
    const connection = await nango.getConnection(integration, connectionId);
    return NextResponse.json({
      connected: true,
      provider: integration,
      connectionId,
      createdAt: connection.created_at,
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
