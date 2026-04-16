---
name: automate
description: Propose automation for a specific bottleneck
trigger: When the user asks to automate, fix a bottleneck, or says "how do I fix this"
---

# Automation Proposal Skill

When triggered, analyze a bottleneck and propose ready-to-deploy automations.

## Steps

1. **Identify the bottleneck** — What specific step/handoff is causing the delay? Get the measured data.
2. **Match to templates** — Check `automation-templates.ts` and `automation-templates-extended.ts` for matching templates
3. **Propose 3 options** at different effort levels:
   - **Quick win** (low effort, deploy in < 1 hour) — Usually a notification or simple routing rule
   - **Medium solution** (medium effort, deploy in 1 day) — Validation automation, conditional routing
   - **Full automation** (high effort, deploy in 1 week) — End-to-end workflow with multiple tools
4. **For each option show:**
   - What it does (step by step workflow)
   - Tools needed
   - Estimated time saved (labeled ESTIMATE)
   - Estimated cost impact (labeled ESTIMATE)
   - Implementation effort
   - Configurable rules the client can adjust
5. **Recommend one** — Based on the client's situation

## Rules
- NEVER propose automation without proven bottleneck data
- Always show the "before" (current state with measured delays) and "after" (projected improvement)
- All time/cost savings labeled as ESTIMATE
- Include configurable rules (thresholds, delays, notification channels)
- Mention which tools are required (n8n, Slack, Gmail, etc.)

## Automation Categories
- Notification: alerts when something needs attention
- Validation: auto-approve based on rules
- Routing: direct work to the right person/team
- Sync: keep tools in sync automatically
- Reporting: automated KPI compilation

## Output Format
For each option: Name | What it does | Tools needed | Time saved | Cost impact | Effort level | Key configurable rules
