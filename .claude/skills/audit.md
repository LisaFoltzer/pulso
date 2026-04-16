---
name: audit
description: Run a complete process audit analysis on email data
trigger: When the user asks to audit, analyze processes, or run an analysis
---

# Process Audit Skill

When triggered, perform a complete process audit following this sequence:

## Steps

1. **Check data source** — Ask if the user wants to analyze real emails (via Gmail/Outlook connection) or use the mock data for demo
2. **Run stats engine** — If real data, call the stats engine first to pre-compute people stats, pair stats, thread stats, keywords, and temporal patterns
3. **Present pre-analysis** — Show the user the stats summary: how many emails, how many people, top communicators, busiest days, most used keywords
4. **Run Claude analysis** — Execute the 5-pass pipeline (or call /api/analyze with each pass)
5. **Present results** — Show detected processes with:
   - Name (using company's own terminology)
   - Health score and confidence
   - Steps and roles identified
   - Measured durations
   - Bottlenecks with evidence
   - Recommendations

## Rules
- Always use the company's own terminology from the emails
- Every duration must be labeled MEASURED or ESTIMATED
- Confidence below 70% must be labeled as HYPOTHESIS
- Never mention individual employee names
- Focus on the top 3 most impactful findings
- End with a clear "next steps" recommendation

## Output Format
Present results as a structured report with sections: Executive Summary, Processes Detected, Bottlenecks, Recommendations, Next Steps.
