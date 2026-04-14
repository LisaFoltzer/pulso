"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AnalysisProvider } from "@/components/analysis-provider";

const FULL_SCREEN_ROUTES = ["/landing", "/login"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname.startsWith(r));

  if (isFullScreen) {
    return <AnalysisProvider>{children}</AnalysisProvider>;
  }

  return (
    <AnalysisProvider>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: "220px" }}>
        <Header />
        <main className="flex-1 px-5 py-4" style={{ backgroundColor: "#FAFAFA" }}>
          {children}
        </main>
      </div>
    </AnalysisProvider>
  );
}
