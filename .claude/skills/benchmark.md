---
name: benchmark
description: Compare a process against industry standards
trigger: When the user asks to benchmark, compare, or asks "how do we compare" or "where do we stand"
---

# Benchmark Comparison Skill

When triggered, compare a specific process or the entire company against industry benchmarks.

## Steps

1. **Identify the process** — Ask which process to benchmark, or benchmark all detected processes
2. **Match to sector** — Determine the company's sector from onboarding data or ask
3. **Load benchmarks** — Get relevant benchmarks from `process-patterns.ts` and `sectors-extended.ts`
4. **Compare** — For each metric:
   - Show the company's measured value
   - Show the industry top quartile, median, and bottom quartile
   - Indicate where the company falls (top 25%, median, bottom 25%)
5. **Identify gaps** — Highlight where the company is below median
6. **Recommend** — For each gap, suggest specific actions to improve

## Rules
- Only benchmark metrics that have been MEASURED, not estimated
- Always show the source of benchmark data
- Present as a comparison table
- Highlight both strengths AND weaknesses
- Be honest about data limitations

## Available Sectors
E-commerce, SaaS, Consulting, Real Estate, Healthcare, Retail, Logistics, Food/Restaurant, Marketing Agency

## Output Format
Table format showing: Metric | Your Value | Top 25% | Median | Bottom 25% | Your Position
Followed by: Key Gaps and Recommended Actions
