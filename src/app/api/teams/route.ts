import { NextRequest, NextResponse } from "next/server";

// Fetch Teams messages via Microsoft Graph API
export async function GET(request: NextRequest) {
  const token = request.cookies.get("microsoft_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated with Microsoft" }, { status: 401 });
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };

    // 1. Get joined teams
    const teamsRes = await fetch("https://graph.microsoft.com/v1.0/me/joinedTeams", { headers });
    const teamsData = await teamsRes.json();
    const teams = teamsData.value || [];

    const allMessages: Record<string, unknown>[] = [];

    // 2. For each team, get channels and recent messages
    for (const team of teams.slice(0, 10)) {
      const channelsRes = await fetch(
        `https://graph.microsoft.com/v1.0/teams/${team.id}/channels`,
        { headers }
      );
      const channelsData = await channelsRes.json();

      for (const channel of (channelsData.value || []).slice(0, 5)) {
        try {
          const msgsRes = await fetch(
            `https://graph.microsoft.com/v1.0/teams/${team.id}/channels/${channel.id}/messages?$top=50`,
            { headers }
          );
          const msgsData = await msgsRes.json();

          for (const msg of msgsData.value || []) {
            allMessages.push({
              id: msg.id,
              teamName: team.displayName,
              channelName: channel.displayName,
              from: msg.from?.user?.displayName || "Unknown",
              date: msg.createdDateTime,
              body: (msg.body?.content || "")
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 400),
              subject: `${team.displayName} / ${channel.displayName}`,
              replyCount: msg.replyCount || 0,
            });
          }
        } catch {
          // Skip channels we can't access
        }
      }
    }

    // 3. Also get recent chats
    try {
      const chatsRes = await fetch(
        "https://graph.microsoft.com/v1.0/me/chats?$top=20&$orderby=lastUpdatedDateTime desc",
        { headers }
      );
      const chatsData = await chatsRes.json();

      for (const chat of (chatsData.value || []).slice(0, 10)) {
        try {
          const chatMsgsRes = await fetch(
            `https://graph.microsoft.com/v1.0/me/chats/${chat.id}/messages?$top=20`,
            { headers }
          );
          const chatMsgsData = await chatMsgsRes.json();

          for (const msg of chatMsgsData.value || []) {
            allMessages.push({
              id: msg.id,
              teamName: "Chat privé",
              channelName: chat.topic || "Direct",
              from: msg.from?.user?.displayName || "Unknown",
              date: msg.createdDateTime,
              body: (msg.body?.content || "")
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 400),
              subject: `Chat: ${chat.topic || "Direct"}`,
              replyCount: 0,
            });
          }
        } catch {
          // Skip chats we can't access
        }
      }
    } catch {
      // Chats API might not be available
    }

    // Transform to unified email-like format for the analysis pipeline
    const events = allMessages.map((msg) => ({
      id: msg.id,
      from: msg.from,
      to: "",
      cc: "",
      subject: msg.subject,
      date: msg.date,
      hasAttachments: false,
      bodyPreview: ((msg.body as string) || "").slice(0, 200),
      body: msg.body,
      threadId: `teams-${msg.channelName}-${msg.id}`,
      conversationId: `teams-${msg.channelName}`,
      source: "teams",
    }));

    return NextResponse.json({
      events,
      count: allMessages.length,
      teams: teams.length,
    });
  } catch (error) {
    console.error("Teams API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Teams messages" },
      { status: 500 }
    );
  }
}
