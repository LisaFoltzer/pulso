"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
              <circle cx="12" cy="12" r="3.5" fill="white" opacity="0.9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#0F172A" }}>Pulso</h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            Audit automatisé de vos process
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
        >
          {!sent ? (
            <>
              <h2 className="text-base font-bold mb-1" style={{ color: "#0F172A" }}>
                Sign in
              </h2>
              <p className="text-xs mb-6" style={{ color: "#94A3B8" }}>
                Enter your email and we'll send you a sign-in link.
              </p>

              <form onSubmit={handleLogin}>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#64748B" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none mb-4"
                  style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
                  required
                  autoFocus
                />

                {error && (
                  <p className="text-xs mb-3" style={{ color: "#EF4444" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                  }}
                >
                  {loading ? "Sending..." : "Send sign-in link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 12l4 4 8-8" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-base font-bold mb-2" style={{ color: "#0F172A" }}>
                Email envoyé !
              </h2>
              <p className="text-sm mb-4" style={{ color: "#94A3B8" }}>
                Un lien de connexion a été envoyé à<br />
                <strong style={{ color: "#0F172A" }}>{email}</strong>
              </p>
              <p className="text-xs" style={{ color: "#CBD5E1" }}>
                Vérifiez vos spams si vous ne le voyez pas.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-4 text-xs font-medium"
                style={{ color: "#6366F1" }}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] mt-6" style={{ color: "#CBD5E1" }}>
          By signing in, you agree to Pulso's terms of use.
        </p>
      </div>
    </div>
  );
}
