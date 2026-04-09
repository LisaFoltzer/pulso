"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/onboarding": "Onboarding",
  "/discovery": "Sources",
  "/process-maps": "Process Maps",
  "/timeline": "Timeline",
  "/personnes": "People",
  "/insights": "Intelligence",
  "/sparring": "Sparring Partner",
  "/automations": "Automations",
  "/roles": "Roles & Capacity",
  "/login": "Sign in",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Pulso";

  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-6"
      style={{
        backgroundColor: "rgba(250,250,250,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E5E5",
        height: "48px",
      }}
    >
      <h1 className="text-[13px] font-semibold" style={{ color: "#171717" }}>
        {title}
      </h1>
      <span className="text-[11px] font-medium" style={{ color: "#A3A3A3" }}>
        {today}
      </span>
    </header>
  );
}
