"use client";

import { useState } from "react";
import type { AutomationWithRules, AutomationRule } from "@/lib/automation-rules";
import { getDefaultValue } from "@/lib/automation-rules";

export function RuleEditor({
  automation,
  sectorId,
  onClose,
  onSave,
}: {
  automation: AutomationWithRules;
  sectorId?: string;
  onClose: () => void;
  onSave: (values: Record<string, number | string | boolean>) => void;
}) {
  const [values, setValues] = useState<Record<string, number | string | boolean>>(() => {
    const initial: Record<string, number | string | boolean> = {};
    for (const rule of automation.rules) {
      initial[rule.id] = getDefaultValue(rule, sectorId);
    }
    return initial;
  });

  function updateValue(id: string, value: number | string | boolean) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl animate-scale-in" style={{ backgroundColor: "#FFFFFF" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-white" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{automation.icon}</span>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#0F172A" }}>{automation.name}</h2>
              <p className="text-[10px]" style={{ color: "#94A3B8" }}>{automation.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Workflow preview */}
        <div className="px-6 py-3" style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <div className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: "#94A3B8" }}>Workflow</div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "#F59E0B15", color: "#F59E0B" }}>Déclencheur</span>
            <span className="text-[10px]" style={{ color: "#475569" }}>{automation.trigger}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {automation.actions.map((action, i) => (
              <span key={i} className="text-[9px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "#3B82F610", color: "#3B82F6" }}>
                {i + 1}. {action}
              </span>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="px-6 py-4 space-y-4">
          <div className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#94A3B8" }}>Paramètres</div>

          {automation.rules.map((rule) => (
            <RuleInput
              key={rule.id}
              rule={rule}
              value={values[rule.id]}
              onChange={(v) => updateValue(rule.id, v)}
              sectorId={sectorId}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 sticky bottom-0 bg-white" style={{ borderTop: "1px solid #E2E8F0" }}>
          <button
            onClick={() => {
              const defaults: Record<string, number | string | boolean> = {};
              for (const rule of automation.rules) defaults[rule.id] = getDefaultValue(rule, sectorId);
              setValues(defaults);
            }}
            className="text-[10px] font-medium"
            style={{ color: "#94A3B8" }}
          >
            Réinitialiser les valeurs par défaut
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-xs font-medium px-4 py-2 rounded-lg" style={{ color: "#64748B" }}>Annuler</button>
            <button
              onClick={() => onSave(values)}
              className="text-xs font-semibold px-5 py-2 rounded-lg text-white"
              style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}
            >
              🚀 Activer l'automatisation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleInput({
  rule,
  value,
  onChange,
  sectorId,
}: {
  rule: AutomationRule;
  value: number | string | boolean;
  onChange: (v: number | string | boolean) => void;
  sectorId?: string;
}) {
  const defaultVal = getDefaultValue(rule, sectorId);
  const isModified = value !== defaultVal;

  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: isModified ? "#EEF2FF" : "#F8FAFC", border: isModified ? "1px solid #C7D2FE" : "1px solid #E2E8F0" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>{rule.label}</span>
          {isModified && <span className="ml-2 text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ color: "#6366F1", backgroundColor: "#6366F110" }}>Modifié</span>}
        </div>
      </div>
      <p className="text-[10px] mb-2" style={{ color: "#94A3B8" }}>{rule.description}</p>

      {/* Threshold / Duration / Count */}
      {(rule.type === "threshold" || rule.type === "duration" || rule.type === "count") && (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={rule.min || 0}
            max={rule.max || 100}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "#6366F1" }}
          />
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              value={Number(value)}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-16 text-xs font-bold text-center py-1 rounded-lg outline-none"
              style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
            />
            {rule.unit && <span className="text-[10px] font-medium" style={{ color: "#94A3B8" }}>{rule.unit}</span>}
          </div>
        </div>
      )}

      {/* Toggle */}
      {rule.type === "toggle" && (
        <button
          onClick={() => onChange(!value)}
          className="relative w-10 h-5 rounded-full transition-colors"
          style={{ backgroundColor: value ? "#22C55E" : "#CBD5E1" }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
            style={{ left: value ? 22 : 2 }}
          />
        </button>
      )}

      {/* Select */}
      {rule.type === "select" && rule.options && (
        <div className="flex flex-wrap gap-1.5">
          {rule.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                backgroundColor: value === opt.value ? "#6366F1" : "#F1F5F9",
                color: value === opt.value ? "#FFFFFF" : "#64748B",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Default hint */}
      {rule.sectorOverrides && sectorId && (
        <p className="text-[8px] mt-1.5" style={{ color: "#CBD5E1" }}>
          Défaut pour votre secteur : {String(getDefaultValue(rule, sectorId))} {rule.unit || ""}
        </p>
      )}
    </div>
  );
}
