// Stats Engine — Pre-processes emails BEFORE sending to Claude
// Pure math, no AI, no cost, instant results
//
// Gives Claude structured data instead of raw emails
// Result: much better detection accuracy

type Email = {
  id: string;
  from: string;
  to: string;
  cc?: string;
  subject: string;
  date: string;
  body?: string;
  threadId: string;
};

// ═══ HELPERS ═══

function extractEmail(header: string): string {
  const match = header.match(/<([^>]+)>/);
  return match ? match[1].toLowerCase() : header.toLowerCase().trim();
}

function extractName(header: string): string {
  const match = header.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : extractEmail(header).split("@")[0];
}

function extractDomain(header: string): string {
  const email = extractEmail(header);
  return email.split("@")[1] || "";
}

// ═══ MAIN STATS FUNCTION ═══

export function computeEmailStats(emails: Email[]) {
  const people = computePeopleStats(emails);
  const pairs = computePairStats(emails);
  const threads = computeThreadStats(emails);
  const keywords = computeKeywordStats(emails);
  const temporal = computeTemporalStats(emails);
  const domains = computeDomainStats(emails);

  return {
    summary: {
      totalEmails: emails.length,
      uniquePeople: people.length,
      internalDomains: domains.internal,
      externalDomains: domains.external,
      dateRange: temporal.dateRange,
      avgEmailsPerDay: temporal.avgPerDay,
    },
    people,
    pairs,
    threads,
    keywords,
    temporal,
    domains,
  };
}

// ═══ PEOPLE STATS ═══

type PersonStat = {
  email: string;
  name: string;
  domain: string;
  sent: number;
  received: number;
  total: number;
  isInternal: boolean;
  topContacts: { name: string; count: number }[];
  avgResponseTimeHours: number | null;
  activeDays: number;
};

function computePeopleStats(emails: Email[]): PersonStat[] {
  const people = new Map<string, {
    name: string; domain: string; sent: number; received: number;
    contacts: Map<string, number>; responseTimes: number[]; dates: Set<string>;
  }>();

  // Count domains to determine internal/external
  const domainCounts = new Map<string, number>();
  for (const e of emails) {
    const d = extractDomain(e.from);
    domainCounts.set(d, (domainCounts.get(d) || 0) + 1);
  }
  const topDomain = [...domainCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  for (const email of emails) {
    const fromAddr = extractEmail(email.from);
    const fromName = extractName(email.from);
    const fromDomain = extractDomain(email.from);
    const toAddrs = email.to.split(",").map(extractEmail).filter(Boolean);
    const dateStr = new Date(email.date).toISOString().slice(0, 10);

    // Sender stats
    const sender = people.get(fromAddr) || {
      name: fromName, domain: fromDomain, sent: 0, received: 0,
      contacts: new Map(), responseTimes: [], dates: new Set(),
    };
    sender.sent++;
    sender.dates.add(dateStr);
    for (const to of toAddrs) {
      sender.contacts.set(to, (sender.contacts.get(to) || 0) + 1);
    }
    people.set(fromAddr, sender);

    // Receiver stats
    for (const toAddr of toAddrs) {
      const receiver = people.get(toAddr) || {
        name: toAddr.split("@")[0], domain: toAddr.split("@")[1] || "",
        sent: 0, received: 0, contacts: new Map(), responseTimes: [], dates: new Set(),
      };
      receiver.received++;
      receiver.dates.add(dateStr);
      people.set(toAddr, receiver);
    }
  }

  // Calculate response times per person (from thread data)
  const threadMap = new Map<string, Email[]>();
  for (const e of emails) {
    const existing = threadMap.get(e.threadId) || [];
    existing.push(e);
    threadMap.set(e.threadId, existing);
  }

  for (const [, msgs] of threadMap) {
    if (msgs.length < 2) continue;
    const sorted = msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (let i = 1; i < sorted.length; i++) {
      const responder = extractEmail(sorted[i].from);
      const diffMs = new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours > 0 && diffHours < 168) { // ignore > 1 week
        const person = people.get(responder);
        if (person) person.responseTimes.push(diffHours);
      }
    }
  }

  return [...people.entries()]
    .map(([email, data]) => ({
      email,
      name: data.name,
      domain: data.domain,
      sent: data.sent,
      received: data.received,
      total: data.sent + data.received,
      isInternal: data.domain === topDomain,
      topContacts: [...data.contacts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([addr, count]) => ({ name: people.get(addr)?.name || addr, count })),
      avgResponseTimeHours: data.responseTimes.length > 0
        ? Math.round(data.responseTimes.reduce((s, t) => s + t, 0) / data.responseTimes.length * 10) / 10
        : null,
      activeDays: data.dates.size,
    }))
    .sort((a, b) => b.total - a.total);
}

// ═══ PAIR STATS (who talks to who) ═══

type PairStat = {
  personA: string;
  personB: string;
  nameA: string;
  nameB: string;
  totalExchanges: number;
  avgResponseTimeHours: number | null;
  longestGapHours: number | null;
  topSubjects: string[];
};

function computePairStats(emails: Email[]): PairStat[] {
  const pairs = new Map<string, {
    personA: string; personB: string; nameA: string; nameB: string;
    exchanges: number; responseTimes: Array<number>; subjects: Map<string, number>;
  }>();

  type PairData = { personA: string; personB: string; nameA: string; nameB: string; exchanges: number; responseTimes: Array<number>; subjects: Map<string, number> };

  const threadMap = new Map<string, Email[]>();
  for (const e of emails) {
    const existing = threadMap.get(e.threadId) || [];
    existing.push(e);
    threadMap.set(e.threadId, existing);
  }

  for (const [, msgs] of threadMap) {
    const sorted = msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < sorted.length; i++) {
      const from = extractEmail(sorted[i].from);
      const toAddrs = sorted[i].to.split(",").map(extractEmail).filter(Boolean);

      for (const to of toAddrs) {
        const key = [from, to].sort().join("↔");
        const pair: PairData = pairs.get(key) as PairData || {
          personA: [from, to].sort()[0],
          personB: [from, to].sort()[1],
          nameA: extractName(sorted[i].from),
          nameB: extractName(sorted[i].to.split(",")[0]),
          exchanges: 0,
          responseTimes: [] as number[],
          subjects: new Map<string, number>(),
        };
        pair.exchanges++;

        // Track subject
        const subj = sorted[i].subject.replace(/^(re|fw|fwd|tr):\s*/gi, "").trim().slice(0, 50);
        if (subj) pair.subjects.set(subj, (pair.subjects.get(subj) || 0) + 1);

        // Response time
        if (i > 0) {
          const diffMs = new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime();
          const diffH = diffMs / (1000 * 60 * 60);
          if (diffH > 0 && diffH < 168) pair.responseTimes.push(diffH);
        }

        pairs.set(key, pair);
      }
    }
  }

  return [...pairs.values()]
    .map((p) => ({
      personA: p.personA,
      personB: p.personB,
      nameA: p.nameA,
      nameB: p.nameB,
      totalExchanges: p.exchanges,
      avgResponseTimeHours: p.responseTimes.length > 0
        ? Math.round(p.responseTimes.reduce((s, t) => s + t, 0) / p.responseTimes.length * 10) / 10
        : null,
      longestGapHours: p.responseTimes.length > 0
        ? Math.round(Math.max(...p.responseTimes) * 10) / 10
        : null,
      topSubjects: [...p.subjects.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([s]) => s),
    }))
    .sort((a, b) => b.totalExchanges - a.totalExchanges);
}

// ═══ THREAD STATS ═══

type ThreadStat = {
  threadId: string;
  subject: string;
  messageCount: number;
  participants: string[];
  durationHours: number;
  avgGapHours: number;
  longestGapHours: number;
  firstDate: string;
  lastDate: string;
};

function computeThreadStats(emails: Email[]): ThreadStat[] {
  const threads = new Map<string, Email[]>();
  for (const e of emails) {
    const existing = threads.get(e.threadId) || [];
    existing.push(e);
    threads.set(e.threadId, existing);
  }

  return [...threads.entries()]
    .filter(([, msgs]) => msgs.length >= 2)
    .map(([threadId, msgs]) => {
      const sorted = msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const participants = [...new Set(sorted.map((m) => extractName(m.from)))];
      const firstDate = sorted[0].date;
      const lastDate = sorted[sorted.length - 1].date;
      const durationMs = new Date(lastDate).getTime() - new Date(firstDate).getTime();

      const gaps: number[] = [];
      for (let i = 1; i < sorted.length; i++) {
        const diffMs = new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime();
        gaps.push(diffMs / (1000 * 60 * 60));
      }

      return {
        threadId,
        subject: sorted[0].subject.replace(/^(re|fw|fwd|tr):\s*/gi, "").trim(),
        messageCount: msgs.length,
        participants,
        durationHours: Math.round(durationMs / (1000 * 60 * 60) * 10) / 10,
        avgGapHours: gaps.length > 0 ? Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length * 10) / 10 : 0,
        longestGapHours: gaps.length > 0 ? Math.round(Math.max(...gaps) * 10) / 10 : 0,
        firstDate,
        lastDate,
      };
    })
    .sort((a, b) => b.messageCount - a.messageCount);
}

// ═══ KEYWORD STATS ═══

type KeywordStat = { word: string; count: number; category: string };

function computeKeywordStats(emails: Email[]): KeywordStat[] {
  const categories: Record<string, string[]> = {
    "commande/vente": ["commande", "order", "achat", "devis", "facture", "invoice", "paiement", "payment", "livraison", "shipping", "tracking"],
    "support": ["problème", "erreur", "bug", "ticket", "urgent", "résolu", "fix", "aide", "help", "issue"],
    "projet": ["projet", "deadline", "livrable", "milestone", "sprint", "spec", "brief", "validation"],
    "recrutement": ["candidat", "entretien", "poste", "cv", "recrutement", "embauche", "offre"],
    "finance": ["budget", "coût", "marge", "trésorerie", "virement", "comptabilité", "bilan"],
    "marketing": ["campagne", "ads", "newsletter", "conversion", "landing", "seo", "social"],
    "onboarding": ["bienvenue", "welcome", "formation", "setup", "onboarding", "kick-off"],
  };

  const counts = new Map<string, { count: number; category: string }>();

  for (const email of emails) {
    const text = `${email.subject} ${email.body || ""}`.toLowerCase();
    for (const [category, words] of Object.entries(categories)) {
      for (const word of words) {
        if (text.includes(word)) {
          const existing = counts.get(word) || { count: 0, category };
          existing.count++;
          counts.set(word, existing);
        }
      }
    }
  }

  return [...counts.entries()]
    .map(([word, data]) => ({ word, ...data }))
    .sort((a, b) => b.count - a.count);
}

// ═══ TEMPORAL STATS ═══

function computeTemporalStats(emails: Email[]) {
  const dates = emails.map((e) => new Date(e.date));
  const validDates = dates.filter((d) => !isNaN(d.getTime()));

  if (validDates.length === 0) {
    return { dateRange: { from: "", to: "" }, avgPerDay: 0, byDayOfWeek: [], byHour: [], busyDays: [], quietDays: [] };
  }

  const sorted = validDates.sort((a, b) => a.getTime() - b.getTime());
  const from = sorted[0].toISOString().slice(0, 10);
  const to = sorted[sorted.length - 1].toISOString().slice(0, 10);
  const daySpan = Math.max(1, (sorted[sorted.length - 1].getTime() - sorted[0].getTime()) / (1000 * 60 * 60 * 24));

  // By day of week
  const dayOfWeek = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  for (const d of validDates) dayOfWeek[d.getDay()]++;

  // By hour
  const byHour = new Array(24).fill(0);
  for (const d of validDates) byHour[d.getHours()]++;

  // By date (for busy/quiet days)
  const byDate = new Map<string, number>();
  for (const d of validDates) {
    const key = d.toISOString().slice(0, 10);
    byDate.set(key, (byDate.get(key) || 0) + 1);
  }
  const sortedDays = [...byDate.entries()].sort((a, b) => b[1] - a[1]);

  return {
    dateRange: { from, to },
    avgPerDay: Math.round(emails.length / daySpan * 10) / 10,
    byDayOfWeek: dayOfWeek.map((count, i) => ({ day: dayNames[i], count })),
    byHour: byHour.map((count, i) => ({ hour: i, count })),
    busyDays: sortedDays.slice(0, 5).map(([date, count]) => ({ date, count })),
    quietDays: sortedDays.slice(-5).reverse().map(([date, count]) => ({ date, count })),
  };
}

// ═══ DOMAIN STATS ═══

function computeDomainStats(emails: Email[]) {
  const domains = new Map<string, number>();
  for (const e of emails) {
    const d = extractDomain(e.from);
    domains.set(d, (domains.get(d) || 0) + 1);
  }

  const sorted = [...domains.entries()].sort((a, b) => b[1] - a[1]);
  const topDomain = sorted[0]?.[0] || "";

  return {
    internal: sorted.filter(([d]) => d === topDomain).map(([d, c]) => ({ domain: d, count: c })),
    external: sorted.filter(([d]) => d !== topDomain).slice(0, 20).map(([d, c]) => ({ domain: d, count: c })),
    topDomain,
  };
}

// ═══ BUILD CLAUDE PROMPT FROM STATS ═══

export function buildStatsPromptForClaude(stats: ReturnType<typeof computeEmailStats>): string {
  return `DONNÉES PRÉ-CALCULÉES (mesures réelles, pas des estimations) :

📊 RÉSUMÉ :
- ${stats.summary.totalEmails} emails sur la période ${stats.summary.dateRange.from} → ${stats.summary.dateRange.to}
- ${stats.summary.uniquePeople} personnes uniques
- ${stats.summary.avgEmailsPerDay} emails/jour en moyenne
- Domaine principal : ${stats.domains.topDomain}
- ${stats.domains.external.length} domaines externes

👥 TOP 10 PERSONNES (par volume) :
${stats.people.slice(0, 10).map((p) =>
    `- ${p.name} (${p.domain}) : ${p.sent} envoyés, ${p.received} reçus${p.avgResponseTimeHours ? `, temps de réponse moyen MESURÉ : ${p.avgResponseTimeHours}h` : ""}, ${p.isInternal ? "INTERNE" : "EXTERNE"}`
  ).join("\n")}

🔗 TOP 10 PAIRES D'ÉCHANGE (qui parle à qui le plus) :
${stats.pairs.slice(0, 10).map((p) =>
    `- ${p.nameA} ↔ ${p.nameB} : ${p.totalExchanges} échanges${p.avgResponseTimeHours ? `, réponse moyenne MESURÉE : ${p.avgResponseTimeHours}h` : ""}${p.longestGapHours ? `, plus long silence : ${p.longestGapHours}h` : ""}\n  Sujets : ${p.topSubjects.join(", ")}`
  ).join("\n")}

💬 TOP 15 CONVERSATIONS (threads les plus longs) :
${stats.threads.slice(0, 15).map((t) =>
    `- "${t.subject}" : ${t.messageCount} messages, ${t.participants.length} participants (${t.participants.join(", ")}), durée MESURÉE : ${t.durationHours}h, gap moyen : ${t.avgGapHours}h`
  ).join("\n")}

🔑 MOTS-CLÉS DÉTECTÉS (fréquence réelle) :
${stats.keywords.slice(0, 20).map((k) =>
    `- "${k.word}" : ${k.count} occurrences (catégorie : ${k.category})`
  ).join("\n")}

📅 ACTIVITÉ TEMPORELLE :
- Jours les plus actifs : ${stats.temporal.byDayOfWeek.sort((a, b) => b.count - a.count).slice(0, 3).map((d) => `${d.day} (${d.count})`).join(", ")}
- Heures de pointe : ${stats.temporal.byHour.sort((a, b) => b.count - a.count).slice(0, 3).map((h) => `${h.hour}h (${h.count})`).join(", ")}
- Journée la plus chargée : ${stats.temporal.busyDays[0]?.date} (${stats.temporal.busyDays[0]?.count} emails)

IMPORTANT : Toutes les durées ci-dessus sont MESURÉES (calculées à partir des timestamps réels), pas estimées.`;
}
