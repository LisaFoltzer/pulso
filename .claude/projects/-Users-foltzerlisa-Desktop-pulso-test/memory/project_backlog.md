---
name: Pulso backlog and sprint plan
description: Complete feature backlog with priorities, sprint plan, and critical anti-hallucination requirements
type: project
---

## Critical Rules
- **Anti-hallucination**: Every AI claim must be traceable to real events. Confidence score on every detection. Under 70% = "hypothesis to verify". Never invent financial numbers — always label "estimation". Show sources: "Based on 14 emails and 3 meetings between March 3-12"
- **Continuous learning**: Store user corrections, improve future detections per company. Sector-based patterns. Custom vocabulary per company. Feedback loop after daily reports.
- **Data handling**: Strict normalization, deduplication, timezone management (multi-country), anonymization for benchmarks, configurable retention.

## Killer Feature — AI Sparring Partner for CEO
Chat with AI acting as experienced COO/DG. Challenges the CEO, proposes alternatives, quantifies impact. Based only on real company data. Admits when it doesn't know.

## Sprint Plan
- Sprint 1: Onboarding, Timeline, Insights, Personnes, Integrations (DONE)
- Sprint 2: Supabase, Auth, Microsoft Graph connector
- Sprint 3: AI detection engine, multi-source normalization, confidence scoring
- Sprint 4: AI Sparring Partner, typed recommendations, user validation + learning
- Sprint 5: Vercel deploy, Landing page, Stripe billing

**How to apply:** Follow sprint order. Anti-hallucination rules apply to ALL AI features. Never show AI output without confidence score and source attribution.
