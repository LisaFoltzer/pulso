"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { automationTemplates, categoryConfig, effortConfig, type AutomationTemplate } from "@/lib/automation-templates";

const stepTypeStyles: Record<string, { color: string; label: string }> = {
  trigger: { color: "#D97706", label: "T" },
  condition: { color: "#7C3AED", label: "?" },
  action: { color: "#2563EB", label: "A" },
  delay: { color: "#737373", label: "D" },
};

export default function AutomationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deployed, setDeployed] = useState<Set<string>>(new Set());
  const router = useRouter();

  const categories = ["all", ...Object.keys(categoryConfig)];
  const filtered = selectedCategory === "all" ? automationTemplates : automationTemplates.filter((t) => t.category === selectedCategory);

  function openInSparring(template: AutomationTemplate) {
    sessionStorage.setItem("sparring_question", `Je veux mettre en place "${template.name}". ${template.description} Plan d'implementation et risques ?`);
    router.push("/sparring");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "#171717" }}>Automatisations recommandees</h2>
          <p className="text-[11px]" style={{ color: "#A3A3A3" }}>{automationTemplates.length} automatisations basees sur les goulots detectes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const cfg = cat === "all" ? { label: "Toutes", color: "#171717" } : categoryConfig[cat];
          return (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className="text-[10px] font-medium px-2.5 py-1 rounded-md transition-all" style={{
              backgroundColor: isActive ? "#171717" : "#FFF",
              color: isActive ? "#FAFAFA" : "#737373",
              border: isActive ? "none" : "1px solid #E5E5E5",
            }}>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((template) => {
          const cat = categoryConfig[template.category];
          const effort = effortConfig[template.impact.effort];
          const isExpanded = expanded === template.id;
          const isDeployed = deployed.has(template.id);

          return (
            <div key={template.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: "#FFF", border: isDeployed ? "1px solid #22C55E" : "1px solid #E5E5E5" }}>
              <div className="px-4 py-3 flex items-start gap-3 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : template.id)}>
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ backgroundColor: cat.color + "08", color: cat.color }}>
                  {template.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[12px] font-semibold" style={{ color: "#171717" }}>{template.name}</span>
                    <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded" style={{ color: cat.color, backgroundColor: cat.color + "08" }}>{cat.label}</span>
                    {isDeployed && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded" style={{ color: "#16A34A", backgroundColor: "#F0FDF4" }}>Actif</span>}
                  </div>
                  <p className="text-[10px]" style={{ color: "#737373" }}>{template.description}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-[10px] font-medium" style={{ color: "#16A34A" }}>{template.impact.timeSaved}</span>
                    <span className="text-[10px] font-medium" style={{ color: "#2563EB" }}>{template.impact.costSaved}</span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ color: effort.color, backgroundColor: effort.color + "08" }}>Effort : {effort.label}</span>
                    <span className="text-[10px]" style={{ color: "#A3A3A3" }}>{template.impact.deployTime}</span>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-1 transition-transform" style={{ transform: isExpanded ? "rotate(180deg)" : "none" }}>
                  <path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke="#A3A3A3" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 animate-fade-in" style={{ borderTop: "1px solid #F5F5F5" }}>
                  <div className="mb-3 px-3 py-2 rounded-md" style={{ backgroundColor: "#FEF2F2" }}>
                    <span className="text-[10px] font-medium" style={{ color: "#DC2626" }}>Probleme : {template.bottleneck}</span>
                  </div>

                  {/* Workflow steps */}
                  <div className="text-[9px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#A3A3A3" }}>Workflow</div>
                  <div className="flex items-start gap-1.5 overflow-x-auto pb-2 mb-3">
                    {template.steps.map((step, i) => {
                      const st = stepTypeStyles[step.type];
                      return (
                        <div key={step.id} className="flex items-center gap-1.5">
                          <div className="flex flex-col items-center gap-1 min-w-[100px]">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: st.color + "10", color: st.color }}>
                              {st.label}
                            </div>
                            <span className="text-[9px] font-medium text-center" style={{ color: "#171717" }}>{step.label}</span>
                            <span className="text-[8px] text-center" style={{ color: "#A3A3A3" }}>{step.tool}</span>
                          </div>
                          {i < template.steps.length - 1 && (
                            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" className="shrink-0 mt-1">
                              <path d="M1 3h8m0 0L7.5 1.5M9 3L7.5 4.5" stroke="#D4D4D4" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tools */}
                  <div className="flex gap-1.5 mb-3">
                    {template.tools.map((tool) => (
                      <span key={tool} className="text-[9px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "#F5F5F5", color: "#525252" }}>{tool}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!isDeployed ? (
                      <button onClick={() => setDeployed((p) => new Set([...p, template.id]))} className="text-[10px] font-semibold px-3 py-1.5 rounded-md text-white" style={{ backgroundColor: "#171717" }}>
                        Deployer
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold px-3 py-1.5 rounded-md" style={{ backgroundColor: "#F0FDF4", color: "#16A34A" }}>Actif</span>
                    )}
                    <button onClick={() => openInSparring(template)} className="text-[10px] font-medium px-3 py-1.5 rounded-md" style={{ color: "#525252", border: "1px solid #E5E5E5" }}>
                      Discuter avec Sparring
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
