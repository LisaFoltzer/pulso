// Connector configuration for all supported integrations

export type ConnectorId = "gmail" | "outlook" | "teams" | "aircall" | "notion";

export type ConnectorConfig = {
  id: ConnectorId;
  name: string;
  description: string;
  icon: string;
  color: string;
  authUrl: string;
  scopes: string;
  dataTypes: string[];
  status: "available" | "coming_soon";
};

export const connectors: ConnectorConfig[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Emails envoyés et reçus, conversations, pièces jointes",
    icon: "📧",
    color: "#EA4335",
    authUrl: "/api/auth/google",
    scopes: "gmail.readonly",
    dataTypes: ["emails"],
    status: "available",
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Emails, calendrier, invitations meetings",
    icon: "📨",
    color: "#0078D4",
    authUrl: "/api/auth/microsoft",
    scopes: "Mail.Read Calendars.Read",
    dataTypes: ["emails", "calendar"],
    status: "available",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Messages dans les canaux, chats privés, meetings",
    icon: "💬",
    color: "#6264A7",
    authUrl: "/api/auth/microsoft",
    scopes: "ChannelMessage.Read.All Chat.Read",
    dataTypes: ["messages", "meetings"],
    status: "available",
  },
  {
    id: "aircall",
    name: "Aircall",
    description: "Appels entrants/sortants, durées, enregistrements",
    icon: "📞",
    color: "#00B388",
    authUrl: "/api/auth/aircall",
    scopes: "read",
    dataTypes: ["calls"],
    status: "available",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Pages, bases de données, wikis internes",
    icon: "📝",
    color: "#000000",
    authUrl: "/api/auth/notion",
    scopes: "read_content",
    dataTypes: ["documents"],
    status: "available",
  },
];

// Env var names for each connector
export const connectorEnvKeys: Record<ConnectorId, { clientId: string; clientSecret: string; extra?: Record<string, string> }> = {
  gmail: {
    clientId: "GOOGLE_CLIENT_ID",
    clientSecret: "GOOGLE_CLIENT_SECRET",
  },
  outlook: {
    clientId: "AZURE_CLIENT_ID",
    clientSecret: "AZURE_CLIENT_SECRET",
    extra: { tenantId: "AZURE_TENANT_ID" },
  },
  teams: {
    clientId: "AZURE_CLIENT_ID",
    clientSecret: "AZURE_CLIENT_SECRET",
    extra: { tenantId: "AZURE_TENANT_ID" },
  },
  aircall: {
    clientId: "AIRCALL_API_ID",
    clientSecret: "AIRCALL_API_TOKEN",
  },
  notion: {
    clientId: "NOTION_CLIENT_ID",
    clientSecret: "NOTION_CLIENT_SECRET",
  },
};
