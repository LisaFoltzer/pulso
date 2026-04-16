@AGENTS.md

# Pulso — AI Process Audit SaaS

## What Pulso Does
Pulso connects to a company's emails, messages, and calls, automatically detects business processes, maps them as interactive flows, measures durations, identifies bottlenecks, and provides AI-powered recommendations.

## Core Philosophy
- **Audit PROCESSES, not PEOPLE** — Never evaluate individual performance. Only analyze workflows, handoffs, and step durations.
- **Measure, don't estimate** — Calculate durations from real timestamps. Label everything clearly as MEASURED or ESTIMATED.
- **Anti-hallucination** — Every claim must be traceable to real data. Confidence scores on every detection. Below 70% = "hypothesis".
- **Concrete, not generic** — Use the company's own terminology. "Sandvig Pharma monthly billing" not "Billing Process".

## Architecture
- Next.js 16 + TypeScript + Tailwind CSS 4
- Supabase (DB + Auth + Row Level Security)
- Claude API via @anthropic-ai/sdk (analysis engine)
- Nango (OAuth connector management)
- React Flow @xyflow/react (process map visualization)
- Framer Motion (landing animations)
- Deployed on Vercel

## Key Directories
- `src/app/` — Pages (dashboard, process-maps, insights, sparring, discovery, roles, automations, onboarding, landing, login)
- `src/components/` — UI components (sidebar, header, flow-map, tabs, etc.)
- `src/components/landing/` — Landing page animation components (particles, glow cards, blobs, mockups)
- `src/lib/` — Business logic (pipeline, patterns, stats engine, knowledge engine, store, prompts, etc.)
- `src/app/api/` — 20+ API routes (analyze, gmail, outlook, slack, hubspot, clickup, salesforce, sparring, cron, auth, etc.)
- `supabase/` — Database schema

## Analysis Pipeline
1. **Collect** — Fetch all emails via Nango/Gmail API (paginated, 90 days)
2. **Filter** — Remove noise (newsletters, notifications, spam) by domain and keywords
3. **Stats Engine** (`src/lib/stats-engine.ts`) — Pre-compute people stats, pair stats, thread stats, keywords, temporal patterns. NO AI, pure math, instant results.
4. **Pass 3: Pattern Detection** — Claude reads email content + pre-computed stats + pattern library, identifies recurring patterns
5. **Pass 4: Process Formalization** — Claude converts patterns into formal processes with steps, roles, flows, scores
6. **Pass 5: Duration & Anomaly Analysis** — Claude analyzes timing data for bottlenecks

## Knowledge Base (3 Levels)
- **Level 1** — Public: 9 sectors, 21 process patterns, 58+ benchmarks (Supabase tables: `sectors`, `process_patterns`, `benchmarks`)
- **Level 2** — Private per company: corrections, vocabulary, custom patterns (tables: `company_patterns`, `corrections`, `vocabulary`)
- **Level 3** — Aggregated anonymous: cross-company metrics (table: `aggregated_metrics`)

## Process Detection Rules

### What to Look For
- Handoffs: "passing this to", "can you take over", "handing off"
- Validations: "approved", "please validate", "waiting for approval"
- Escalations: "escalating to", "need help", "urgent"
- Bottlenecks: long gaps between thread emails, multiple follow-ups, "still waiting"
- Triggers: "new client signed", "order received", "ticket opened"
- Completions: "delivered", "resolved", "closed", "go-live"

### What to Ignore
- Newsletters, marketing, notifications from tools
- Social conversations (lunch, birthday, holiday)
- Automated system emails (Jira, GitHub, Stripe)
- One-off emails that don't repeat as patterns

### Scoring
- 90-100: Smooth flow, fast handoffs, no bottlenecks
- 70-89: Good with minor delays
- 50-69: Significant bottleneck, needs attention
- Below 50: Broken process, immediate action needed

### Red Flags
- One person handling 60%+ of communications (single point of failure)
- Response times > 24h between steps
- Same escalation 3+ times (systemic, not one-off)
- Process taking 2x+ industry benchmark
- Steps regularly skipped

## Lean / Operations Frameworks Applied
- **Value Stream Mapping** — Every process mapped as a value stream with measured cycle times
- **Theory of Constraints** — Identify the ONE bottleneck limiting throughput, not all problems at once
- **Pareto Principle** — Focus recommendations on the 20% of changes that yield 80% of impact
- **PDCA Cycle** — Plan (detect), Do (recommend), Check (measure after), Act (iterate)
- **Waste Detection (TIMWOODS)** — Transport, Inventory, Motion, Waiting, Overprocessing, Overproduction, Defects, Skills underutilization

## Automation Rules
1. Identify the specific bottleneck WITH DATA before recommending anything
2. Propose 2-3 options at different effort levels (low/medium/high)
3. Estimate ROI clearly labeled as "ESTIMATE"
4. Each automation has configurable rules the client can adjust
5. Never recommend automation without proving the bottleneck exists

## Design Rules
- NO emojis anywhere in the app
- App: light theme (#FAFAFA bg, #171717 text, #6366F1 accent)
- Landing: dark theme (#09090B bg, gradient accents)
- Font: DM Sans
- Minimal, professional, inspired by Linear/Vercel
- All text in English

## NEVER
- Show individual employee names in analysis results
- Invent financial numbers without ESTIMATE label
- Use emojis in the app UI
- Store raw emails in the database
- Share one company's data with another
- Skip confidence scores on AI detections
- Use `rm -rf` on the project directory
