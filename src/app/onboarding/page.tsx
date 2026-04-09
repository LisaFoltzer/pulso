"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = { id: number; role: "pulso" | "user"; text: string };

const STEPS = [
  () => "Hello. I'm Pulso. I'll ask you a few questions to understand your business. What is your company name ?",
  (d: Record<string, string>) => `What industry does work in ${d.companyName || "votre entreprise"} ?`,
  (d: Record<string, string>) => `${d.sector ? d.sector.charAt(0).toUpperCase() + d.sector.slice(1) : "Got it"}. How many people on the team ?`,
  () => "What tools do you use daily ? (email, Slack, Teams, CRM, etc.)",
  () => "What is your main operational challenge today ",
  () => "Estimate the time your team wastes each week on repetitive or poorly organized tasks ",
  (d: Record<string, string>) => `Thank you${d.companyName ? ` ${d.companyName}` : ""}. I have what I need. Now connect your data sources to start the analysis.`,
];

const DATA_KEYS = ["companyName", "sector", "teamSize", "tools", "mainProblem", "timeLost"];

export default function OnboardingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComplete = step >= STEPS.length;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([{ id: 0, role: "pulso", text: STEPS[0](data) }]);
      setIsTyping(false);
      setStep(1);
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  function handleSend() {
    if (!input.trim() || isTyping || isComplete) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { id: prev.length, role: "user", text: userText }]);
    setInput("");

    const newData = { ...data };
    if (DATA_KEYS[step - 1]) newData[DATA_KEYS[step - 1]] = userText;
    setData(newData);

    if (step < STEPS.length) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: prev.length, role: "pulso", text: STEPS[step](newData) }]);
        setIsTyping(false);
        setStep((s) => s + 1);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 800 + Math.random() * 600);
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col" style={{ height: "calc(100vh - 48px - 32px)" }}>
      {/* Header */}
      <div className="flex items-center gap-2 py-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#171717" }}>
          <span className="text-[9px] font-bold text-white">P</span>
        </div>
        <span className="text-[12px] font-semibold" style={{ color: "#171717" }}>Pulso</span>
        <span className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>Discovery interview</span>
      </div>

      {/* Chat */}
      <div ref={chatRef} className="flex-1 overflow-y-auto rounded-lg px-4 py-4 space-y-3" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            {msg.role === "pulso" && (
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mr-2 mt-0.5" style={{ backgroundColor: "#F5F5F5" }}>
                <span className="text-[8px] font-bold" style={{ color: "#737373" }}>P</span>
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 text-[13px] leading-relaxed ${msg.role === "user" ? "rounded-lg rounded-br-sm" : "rounded-lg rounded-bl-sm"}`} style={{
              backgroundColor: msg.role === "user" ? "#171717" : "#F5F5F5",
              color: msg.role === "user" ? "#FAFAFA" : "#171717",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mr-2" style={{ backgroundColor: "#F5F5F5" }}>
              <span className="text-[8px] font-bold" style={{ color: "#737373" }}>P</span>
            </div>
            <div className="rounded-lg rounded-bl-sm px-3 py-2 flex gap-1" style={{ backgroundColor: "#F5F5F5" }}>
              <span className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: "#A3A3A3" }} />
              <span className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: "#A3A3A3", animationDelay: "0.15s" }} />
              <span className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: "#A3A3A3", animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3">
        {isComplete ? (
          <a href="/discovery" className="block text-center py-2.5 rounded-md text-[13px] font-semibold text-white" style={{ backgroundColor: "#171717" }}>
            Connect my sources
          </a>
        ) : (
          <div className="flex items-center gap-2 rounded-md px-3 py-1.5" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Your answer..."
              className="flex-1 text-[13px] outline-none py-1.5"
              style={{ color: "#171717" }}
              disabled={isTyping}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-7 h-7 rounded flex items-center justify-center transition-all disabled:opacity-20"
              style={{ backgroundColor: "#171717" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
