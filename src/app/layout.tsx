import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AnalysisProvider } from "@/components/analysis-provider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pulso",
  description: "Process Health Monitoring Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="h-full flex" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <AnalysisProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: "220px" }}>
            <Header />
            <main className="flex-1 px-5 py-4" style={{ backgroundColor: "#FAFAFA" }}>
              {children}
            </main>
          </div>
        </AnalysisProvider>
      </body>
    </html>
  );
}
