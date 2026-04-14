export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold" style={{ color: "#171717" }}>Privacy Policy</h1>
      <p className="text-sm" style={{ color: "#737373" }}>Last updated: April 12, 2026</p>

      <Section title="What Pulso Does">
        Pulso is a process audit tool that connects to your business communication tools (email, messaging, CRM) to automatically detect and map your business processes. We analyze communication patterns to identify workflows, measure durations, and recommend improvements.
      </Section>

      <Section title="What Data We Access">
        When you connect a tool (e.g., Gmail, Outlook, Slack), we request read-only access to your communications. We read email metadata (sender, recipient, subject, date) and body content to detect process patterns. We never write, modify, or delete any of your data.
      </Section>

      <Section title="What We Store">
        We do NOT store your emails or messages. We extract process-level insights (detected processes, health scores, durations, roles) and store only those aggregated results. Your raw communications are processed in memory and discarded. Only the analysis results are persisted in our database.
      </Section>

      <Section title="How We Use Your Data">
        Your data is used exclusively to provide you with process analysis, health scores, recommendations, and benchmarks. We never sell your data. We never share individual company data with third parties. Anonymized, aggregated statistics may be used to improve our detection algorithms and provide industry benchmarks.
      </Section>

      <Section title="Data Security">
        All data is encrypted in transit (HTTPS/TLS) and at rest. We use row-level security ensuring each user can only access their own data. Our database is hosted in EU (Paris, France). We implement rate limiting, secure cookies, and security headers on all endpoints. OAuth tokens are stored securely and never exposed to the client.
      </Section>

      <Section title="GDPR Compliance">
        Pulso is fully GDPR compliant. You have the right to: access all your data (export via API), rectify inaccurate data, delete all your data at any time (account deletion removes everything), restrict processing, and data portability. To exercise any of these rights, contact us at info.lisaconsulting@gmail.com.
      </Section>

      <Section title="Data Retention">
        Analysis results are retained for as long as your account is active. Upon account deletion, all data is permanently removed within 30 days. OAuth tokens are automatically revoked upon disconnection.
      </Section>

      <Section title="Third-Party Services">
        We use the following third-party services to operate Pulso: Supabase (database, EU hosting), Vercel (application hosting), Anthropic Claude API (AI analysis — your data is processed but not stored by Anthropic), and Nango (OAuth connection management). Each service has its own privacy policy and data processing agreements.
      </Section>

      <Section title="Cookies">
        We use essential cookies only: authentication tokens and session management. We do not use tracking cookies, analytics cookies, or advertising cookies.
      </Section>

      <Section title="Contact">
        For any privacy-related questions or requests, contact us at: info.lisaconsulting@gmail.com
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-2" style={{ color: "#171717" }}>{title}</h2>
      <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{children}</p>
    </div>
  );
}
