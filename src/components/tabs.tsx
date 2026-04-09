"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
};

export function Tabs({
  tabs,
  defaultTab,
  children,
}: {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id || "");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-0" style={{ borderBottom: "1px solid #E5E5E5" }}>
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="px-4 py-2 text-[12px] font-medium transition-colors relative"
              style={{ color: isActive ? "#171717" : "#A3A3A3" }}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-[1.5px]" style={{ backgroundColor: "#171717" }} />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex-1 min-h-0 pt-4">
        {children(active)}
      </div>
    </div>
  );
}
