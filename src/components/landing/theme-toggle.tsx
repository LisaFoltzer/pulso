"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
export function useTheme() { return useContext(ThemeContext); }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => { const s = localStorage.getItem("pulso-theme") as Theme | null; if (s) setTheme(s); }, []);
  function toggle() { const n = theme === "dark" ? "light" : "dark"; setTheme(n); localStorage.setItem("pulso-theme", n); }
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
      {theme === "dark" ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="3" stroke="#A3A3A3" strokeWidth="1.2" /><path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3.1 3.1l.7.7M10.2 10.2l.7.7M3.1 10.9l.7-.7M10.2 3.8l.7-.7" stroke="#A3A3A3" strokeWidth="1" strokeLinecap="round" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 8.5A5.5 5.5 0 015.5 2 5.5 5.5 0 1012 8.5z" stroke="#525252" strokeWidth="1.2" /></svg>
      )}
    </button>
  );
}
