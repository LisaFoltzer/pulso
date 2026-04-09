import { Nango } from "@nangohq/node";

// Server-side Nango client
export const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

// Get Gmail access token for a user via Nango
export async function getGmailToken(connectionId: string): Promise<string | null> {
  try {
    const token = await nango.getToken("google-mail", connectionId);
    if (typeof token === "string") return token;
    if (typeof token === "object" && "access_token" in token) return (token as { access_token: string }).access_token;
    return String(token);
  } catch (error) {
    console.error("Failed to get Gmail token from Nango:", error);
    return null;
  }
}

// Connection ID format: use the user's email or a unique ID
export function buildConnectionId(userId: string): string {
  return `pulso-${userId}`;
}
