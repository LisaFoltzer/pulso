import { NextRequest, NextResponse } from "next/server";

// Fetch pages and databases from Notion
export async function GET(request: NextRequest) {
  const token = request.cookies.get("notion_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated with Notion" }, { status: 401 });
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    };

    // Search all pages and databases
    const searchRes = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers,
      body: JSON.stringify({
        sort: { direction: "descending", timestamp: "last_edited_time" },
        page_size: 100,
      }),
    });
    const searchData = await searchRes.json();

    const items = (searchData.results || []).map((item: Record<string, unknown>) => {
      const type = item.object as string; // "page" or "database"
      const properties = item.properties as Record<string, unknown> | undefined;

      // Extract title
      let title = "";
      if (type === "page" && properties) {
        for (const prop of Object.values(properties)) {
          const p = prop as { type?: string; title?: { plain_text?: string }[] };
          if (p.type === "title" && p.title?.[0]?.plain_text) {
            title = p.title[0].plain_text;
            break;
          }
        }
      } else if (type === "database") {
        const dbTitle = (item as { title?: { plain_text?: string }[] }).title;
        title = dbTitle?.[0]?.plain_text || "Untitled Database";
      }

      return {
        id: item.id,
        type,
        title,
        lastEdited: item.last_edited_time,
        url: item.url,
      };
    });

    return NextResponse.json({
      items,
      count: items.length,
    });
  } catch (error) {
    console.error("Notion API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Notion data" },
      { status: 500 }
    );
  }
}
