// Extended Automation Templates — covers all major bottleneck types across sectors

import type { AutomationTemplate } from "./automation-templates";

export const extendedAutomations: AutomationTemplate[] = [
  // ═══ SALES / CRM ═══
  {
    id: "lead-follow-up",
    name: "Lead follow-up automation",
    description: "Automatically send follow-up emails when a lead hasn't been contacted within the configured time window.",
    category: "notification",
    processPattern: "re-lead-to-close",
    bottleneck: "Leads going cold because of slow response time",
    impact: { timeSaved: "~8h/month", costSaved: "~2 missed deals/month", effort: "low", deployTime: "20 min" },
    steps: [
      { id: "s1", type: "trigger", label: "New lead received", description: "When a new lead enters the CRM", icon: "", tool: "hubspot" },
      { id: "s2", type: "delay", label: "Wait configured time", description: "Wait 2h (configurable) for manual contact", icon: "", tool: "n8n" },
      { id: "s3", type: "condition", label: "Has been contacted?", description: "Check if any activity was logged", icon: "", tool: "n8n" },
      { id: "s4", type: "action", label: "Send follow-up email", description: "Automated personalized follow-up", icon: "", tool: "gmail" },
      { id: "s5", type: "action", label: "Notify sales rep", description: "Alert on Slack with lead details", icon: "", tool: "slack" },
    ],
    tools: ["HubSpot", "Gmail", "Slack"],
    deployTarget: "n8n",
  },
  {
    id: "deal-stagnation-alert",
    name: "Deal stagnation alert",
    description: "Alert when a deal hasn't moved stages in X days. Prevents deals from dying silently in the pipeline.",
    category: "notification",
    processPattern: "re-lead-to-close",
    bottleneck: "Deals stuck in pipeline without action",
    impact: { timeSaved: "~4h/month", costSaved: "~3 recovered deals/quarter", effort: "low", deployTime: "15 min" },
    steps: [
      { id: "s1", type: "trigger", label: "Daily check at 9am", description: "Check all open deals", icon: "", tool: "n8n" },
      { id: "s2", type: "condition", label: "Stuck > X days?", description: "No stage change in configured period", icon: "", tool: "n8n" },
      { id: "s3", type: "action", label: "Alert deal owner", description: "Slack DM with deal details", icon: "", tool: "slack" },
      { id: "s4", type: "action", label: "Log activity", description: "Create task in CRM to follow up", icon: "", tool: "hubspot" },
    ],
    tools: ["HubSpot", "Slack"],
    deployTarget: "n8n",
  },

  // ═══ HANDOFF AUTOMATION ═══
  {
    id: "sales-to-cs-handoff",
    name: "Sales to CS automatic handoff",
    description: "When a deal is marked 'Won', automatically create onboarding checklist, assign CSM, notify all parties.",
    category: "sync",
    processPattern: "saas-onboarding",
    bottleneck: "Manual handoff causes delays and dropped information between sales and CS",
    impact: { timeSaved: "~6h/month", costSaved: "Faster time to value", effort: "medium", deployTime: "1h" },
    steps: [
      { id: "s1", type: "trigger", label: "Deal marked Won", description: "When deal stage changes to Closed Won", icon: "", tool: "hubspot" },
      { id: "s2", type: "action", label: "Create onboarding checklist", description: "Generate from template in Notion", icon: "", tool: "notion" },
      { id: "s3", type: "action", label: "Assign CSM", description: "Auto-assign based on workload", icon: "", tool: "n8n" },
      { id: "s4", type: "action", label: "Send welcome email", description: "Personalized welcome to customer", icon: "", tool: "gmail" },
      { id: "s5", type: "action", label: "Notify team", description: "Post in #onboarding channel", icon: "", tool: "slack" },
      { id: "s6", type: "action", label: "Schedule kick-off", description: "Create calendar event", icon: "", tool: "webhook" },
    ],
    tools: ["HubSpot", "Notion", "Gmail", "Slack"],
    deployTarget: "n8n",
  },

  // ═══ APPROVAL WORKFLOWS ═══
  {
    id: "expense-approval",
    name: "Expense approval routing",
    description: "Route expense approvals based on amount. Small expenses auto-approved, large ones require manager sign-off.",
    category: "validation",
    processPattern: "ecom-billing",
    bottleneck: "All expenses wait for the same approver regardless of amount",
    impact: { timeSaved: "~5h/month", costSaved: "Faster expense processing", effort: "low", deployTime: "30 min" },
    steps: [
      { id: "s1", type: "trigger", label: "New expense submitted", description: "Employee submits expense", icon: "", tool: "webhook" },
      { id: "s2", type: "condition", label: "Amount < threshold?", description: "Check against configured limit", icon: "", tool: "n8n" },
      { id: "s3", type: "action", label: "Auto-approve", description: "Mark as approved automatically", icon: "", tool: "webhook" },
      { id: "s4", type: "action", label: "Route to manager", description: "Send approval request if over threshold", icon: "", tool: "slack" },
      { id: "s5", type: "action", label: "Log decision", description: "Record in audit trail", icon: "", tool: "notion" },
    ],
    tools: ["Slack", "Notion", "Webhook"],
    deployTarget: "n8n",
  },

  // ═══ REPORTING ═══
  {
    id: "weekly-ops-report",
    name: "Weekly operations report",
    description: "Compile KPIs from all connected tools into a formatted weekly report sent to leadership.",
    category: "reporting",
    processPattern: "ecom-billing",
    bottleneck: "Manual report compilation takes hours every week",
    impact: { timeSaved: "~4h/week", costSaved: "Consistent reporting", effort: "medium", deployTime: "1h" },
    steps: [
      { id: "s1", type: "trigger", label: "Every Monday 7am", description: "Scheduled weekly trigger", icon: "", tool: "n8n" },
      { id: "s2", type: "action", label: "Pull sales data", description: "Get pipeline and revenue from CRM", icon: "", tool: "hubspot" },
      { id: "s3", type: "action", label: "Pull support data", description: "Get ticket stats", icon: "", tool: "webhook" },
      { id: "s4", type: "action", label: "Compile report", description: "Format into structured report", icon: "", tool: "n8n" },
      { id: "s5", type: "action", label: "Send to leadership", description: "Email or Slack to exec team", icon: "", tool: "slack" },
    ],
    tools: ["HubSpot", "Slack", "Webhook"],
    deployTarget: "n8n",
  },

  // ═══ CUSTOMER SUCCESS ═══
  {
    id: "churn-risk-alert",
    name: "Churn risk detection",
    description: "Alert when customer engagement drops below threshold. Proactive retention instead of reactive.",
    category: "notification",
    processPattern: "saas-onboarding",
    bottleneck: "Churn detected too late to act",
    impact: { timeSaved: "~3h/month", costSaved: "~2 saved customers/quarter", effort: "medium", deployTime: "1h" },
    steps: [
      { id: "s1", type: "trigger", label: "Weekly engagement check", description: "Monitor login/usage metrics", icon: "", tool: "webhook" },
      { id: "s2", type: "condition", label: "Usage dropped > 50%?", description: "Compare to previous period", icon: "", tool: "n8n" },
      { id: "s3", type: "action", label: "Alert CSM", description: "Slack notification with customer details", icon: "", tool: "slack" },
      { id: "s4", type: "action", label: "Create save task", description: "Task in CRM for outreach", icon: "", tool: "hubspot" },
      { id: "s5", type: "action", label: "Send check-in email", description: "Automated but personalized", icon: "", tool: "gmail" },
    ],
    tools: ["Slack", "HubSpot", "Gmail"],
    deployTarget: "n8n",
  },

  // ═══ MULTI-TOOL SYNC ═══
  {
    id: "crm-project-sync",
    name: "CRM to project tool sync",
    description: "When a deal moves to a specific stage, automatically create a project in your project management tool.",
    category: "sync",
    processPattern: "consulting-delivery",
    bottleneck: "Manual project creation causes delays and data loss between CRM and project tool",
    impact: { timeSaved: "~3h/month", costSaved: "Zero data loss between tools", effort: "medium", deployTime: "45 min" },
    steps: [
      { id: "s1", type: "trigger", label: "Deal reaches stage", description: "When deal enters configured stage", icon: "", tool: "hubspot" },
      { id: "s2", type: "action", label: "Create project", description: "New project from template", icon: "", tool: "clickup" },
      { id: "s3", type: "action", label: "Copy deal data", description: "Transfer client info to project", icon: "", tool: "n8n" },
      { id: "s4", type: "action", label: "Assign team", description: "Auto-assign based on skills/load", icon: "", tool: "clickup" },
      { id: "s5", type: "action", label: "Notify team", description: "New project alert", icon: "", tool: "slack" },
    ],
    tools: ["HubSpot", "ClickUp", "Slack"],
    deployTarget: "n8n",
  },

  // ═══ QUALITY CONTROL ═══
  {
    id: "delivery-quality-check",
    name: "Delivery quality check",
    description: "After delivery, automatically send quality survey. Flag negative responses for immediate follow-up.",
    category: "notification",
    processPattern: "lg-order-delivery",
    bottleneck: "Quality issues discovered too late or not at all",
    impact: { timeSaved: "~2h/month", costSaved: "Reduced complaints", effort: "low", deployTime: "20 min" },
    steps: [
      { id: "s1", type: "trigger", label: "Delivery confirmed", description: "When POD is captured", icon: "", tool: "webhook" },
      { id: "s2", type: "delay", label: "Wait 2 hours", description: "Give customer time to inspect", icon: "", tool: "n8n" },
      { id: "s3", type: "action", label: "Send survey", description: "Quick 1-question quality check", icon: "", tool: "gmail" },
      { id: "s4", type: "condition", label: "Negative response?", description: "Check if score < 3/5", icon: "", tool: "n8n" },
      { id: "s5", type: "action", label: "Alert support", description: "Create urgent ticket", icon: "", tool: "slack" },
    ],
    tools: ["Gmail", "Slack", "Webhook"],
    deployTarget: "n8n",
  },
];

export function getExtendedAutomationStats() {
  const total = extendedAutomations.length;
  const categories = [...new Set(extendedAutomations.map((a) => a.category))];
  const totalTimeSaved = extendedAutomations.reduce((s, a) => {
    const match = a.impact.timeSaved.match(/(\d+)/);
    return s + (match ? parseInt(match[1]) : 0);
  }, 0);
  return { total, categories: categories.length, totalTimeSaved: `~${totalTimeSaved}h/month` };
}
