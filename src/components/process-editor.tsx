"use client";

import { useState } from "react";
import type { DetectedProcessResult } from "@/lib/pipeline";
import { saveCompanyPattern, saveUserCorrection } from "@/lib/knowledge-engine";

export function ProcessEditor({
  process,
  onClose,
  onSave,
}: {
  process: DetectedProcessResult;
  onClose: () => void;
  onSave: (updated: DetectedProcessResult) => void;
}) {
  const [name, setName] = useState(process.name);
  const [description, setDescription] = useState(process.description);
  const [steps, setSteps] = useState(process.steps);
  const [roles, setRoles] = useState(process.roles);

  function handleStepChange(i: number, value: string) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, ""]);
  }

  function removeStep(i: number) {
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleRoleChange(i: number, field: "label" | "department", value: string) {
    setRoles((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );
  }

  async function handleSave() {
    const updated = {
      ...process,
      name,
      description,
      steps: steps.filter((s) => s.trim()),
      roles,
    };

    // Save corrections to knowledge base (Level 2)
    try {
      if (name !== process.name) {
        await saveUserCorrection(process.name, "name", process.name, name);
      }
      if (JSON.stringify(steps) !== JSON.stringify(process.steps)) {
        await saveUserCorrection(process.name, "steps", process.steps, steps);
      }
      if (JSON.stringify(roles) !== JSON.stringify(process.roles)) {
        await saveUserCorrection(process.name, "roles", process.roles, roles);
      }

      // Save as company pattern
      await saveCompanyPattern({
        name,
        steps,
        roles,
        notes: `Modifié manuellement le ${new Date().toLocaleDateString("fr-FR")}`,
      });
    } catch {
      // Non-blocking
    }

    onSave(updated);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl animate-scale-in"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>
              Éditer le process
            </h2>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              Normalisez et enrichissez les données détectées par l'IA
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#64748B" }}>
              Nom du process
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-colors"
              style={{
                border: "1px solid #E2E8F0",
                color: "#0F172A",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#64748B" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
            />
          </div>

          {/* Steps */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#64748B" }}>
              Étapes du process
            </label>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: "#EEF2FF", color: "#6366F1" }}
                  >
                    {i + 1}
                  </span>
                  <input
                    value={step}
                    onChange={(e) => handleStepChange(i, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
                    style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
                    placeholder="Nom de l'étape..."
                  />
                  <button
                    onClick={() => removeStep(i)}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addStep}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-indigo-50"
                style={{ color: "#6366F1", border: "1px dashed #C7D2FE" }}
              >
                + Ajouter une étape
              </button>
            </div>
          </div>

          {/* Roles */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#64748B" }}>
              Rôles impliqués
            </label>
            <div className="space-y-2">
              {roles.map((role, i) => (
                <div key={role.id} className="flex items-center gap-2">
                  <input
                    value={role.label}
                    onChange={(e) => handleRoleChange(i, "label", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
                    style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
                    placeholder="Rôle..."
                  />
                  <input
                    value={role.department}
                    onChange={(e) => handleRoleChange(i, "department", e.target.value)}
                    className="w-36 px-3 py-1.5 rounded-lg text-sm outline-none"
                    style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
                    placeholder="Département..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI confidence notice */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ backgroundColor: "#FFFBEB", border: "1px solid #FEF3C7" }}
          >
            <span className="text-sm">💡</span>
            <div>
              <p className="text-xs font-medium" style={{ color: "#92400E" }}>
                Détection automatique
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#A16207" }}>
                Ce process a été détecté par l'IA à partir de vos communications.
                Les étapes et rôles se préciseront au fur et à mesure que Pulso
                collecte plus de données. Vos modifications manuelles sont prioritaires.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 sticky bottom-0"
          style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ color: "#64748B" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
