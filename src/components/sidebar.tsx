"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAnalysis } from "@/lib/store";
import { supabase, signOut } from "@/lib/supabase";

type NavItem = { label: string; href: string; icon: (p: { active: boolean }) => React.ReactNode };
type NavSection = { title: string; items: NavItem[] };

export function Sidebar() {
  const pathname = usePathname();
  const { analysis } = useAnalysis();
  const hasData = analysis && analysis.processes.length > 0;
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || null));
  }, []);

  const sections: NavSection[] = [
    {
      title: "",
      items: [
        { label: "Dashboard", href: "/", icon: IconDashboard },
      ],
    },
    {
      title: "Analysis",
      items: [
        { label: "Process Maps", href: "/process-maps", icon: IconProcess },
        { label: "Intelligence", href: "/insights", icon: IconInsights },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Sources", href: "/discovery", icon: IconSources },
        { label: "Onboarding", href: "/onboarding", icon: IconOnboarding },
      ],
    },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen flex flex-col justify-between" style={{ width: 220, backgroundColor: "#0A0A0A", padding: "16px 8px" }}>
      <div>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-3 mb-5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
              <circle cx="7" cy="7" r="2" fill="white" opacity="0.85" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">Pulso</span>
        </Link>

        {/* Status */}
        <div className="mx-2 mb-4 px-2.5 py-1.5 rounded-md" style={{ backgroundColor: hasData ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hasData ? "#22C55E" : "#404040" }} />
            <span className="text-[10px] font-medium" style={{ color: hasData ? "#4ADE80" : "#525252" }}>
              {hasData ? `${analysis.processes.length} process` : "Not connected"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {sections.map((section) => (
            <div key={section.title || "main"}>
              {section.title && (
                <div className="text-[9px] font-medium uppercase tracking-widest px-3 mb-1" style={{ color: "#525252" }}>
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
                      style={{
                        color: isActive ? "#FAFAFA" : "#A3A3A3",
                        backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                      }}
                    >
                      <item.icon active={isActive} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold" style={{ backgroundColor: "#262626", color: "#A3A3A3" }}>
          {userEmail ? userEmail.slice(0, 2).toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-neutral-300 truncate">
            {userEmail || "Not connected"}
          </div>
          {userEmail ? (
            <button onClick={signOut} className="text-[9px] text-neutral-600 hover:text-neutral-400 transition-colors">Sign out</button>
          ) : (
            <a href="/login" className="text-[9px] text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</a>
          )}
        </div>
      </div>
    </aside>
  );
}

// Icons — minimal, 14px, stroke only
function IconDashboard({ active }: { active: boolean }) {
  const c = active ? "#E5E5E5" : "#525252";
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2" /><rect x="8" y="1" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2" /><rect x="1" y="8" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2" /><rect x="8" y="8" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2" /></svg>;
}

function IconProcess({ active }: { active: boolean }) {
  const c = active ? "#E5E5E5" : "#525252";
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="2" stroke={c} strokeWidth="1.2" /><circle cx="11" cy="3.5" r="2" stroke={c} strokeWidth="1.2" /><circle cx="11" cy="10.5" r="2" stroke={c} strokeWidth="1.2" /><path d="M5 6.2L9 4.3M5 7.8L9 9.7" stroke={c} strokeWidth="1.2" /></svg>;
}

function IconInsights({ active }: { active: boolean }) {
  const c = active ? "#E5E5E5" : "#525252";
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11z" stroke={c} strokeWidth="1.2" /><path d="M7 4.5V7l2 1.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" /></svg>;
}

function IconSources({ active }: { active: boolean }) {
  const c = active ? "#E5E5E5" : "#525252";
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="5" width="4.5" height="4.5" rx="1" stroke={c} strokeWidth="1.2" /><rect x="8.5" y="5" width="4.5" height="4.5" rx="1" stroke={c} strokeWidth="1.2" /><path d="M5.5 7.25h3" stroke={c} strokeWidth="1.2" strokeLinecap="round" /></svg>;
}

function IconOnboarding({ active }: { active: boolean }) {
  const c = active ? "#E5E5E5" : "#525252";
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1.5" stroke={c} strokeWidth="1.2" /><path d="M5.5 5.5l3 1.5-3 1.5z" fill={c} /></svg>;
}
