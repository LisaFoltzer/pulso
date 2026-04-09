import { NextRequest, NextResponse } from "next/server";

// Aircall uses Basic Auth (API ID + API Token), not OAuth
// The client sends credentials via POST, we validate and store them
export async function POST(request: NextRequest) {
  const { apiId, apiToken } = await request.json();

  if (!apiId || !apiToken) {
    return NextResponse.json({ error: "API ID and Token required" }, { status: 400 });
  }

  // Validate credentials by calling Aircall API
  try {
    const credentials = Buffer.from(`${apiId}:${apiToken}`).toString("base64");
    const res = await fetch("https://api.aircall.io/v1/company", {
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Invalid Aircall credentials" }, { status: 401 });
    }

    const company = await res.json();

    const response = NextResponse.json({
      success: true,
      company: company.company?.name || "Connected",
    });

    // Store credentials in cookie
    response.cookies.set("aircall_credentials", credentials, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Aircall auth error:", error);
    return NextResponse.json({ error: "Failed to connect to Aircall" }, { status: 500 });
  }
}
