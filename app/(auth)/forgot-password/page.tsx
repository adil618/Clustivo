"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-[oklch(0.145_0_0)] flex items-center justify-center px-4 py-6 font-sans">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] flex items-center justify-center text-xl">
            🤝
          </div>
          <span className="text-[22px] font-extrabold text-[#FF6B2B] tracking-tight">
            Clustivo
          </span>
        </div>

        {/* Card */}
        <div className="bg-[oklch(0.205_0_0)] rounded-[20px] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10">
          {/* Lock icon */}
          <div className="w-[72px] h-[72px] rounded-full bg-[rgba(255,107,43,0.12)] border-2 border-[#FF6B2B] flex items-center justify-center mx-auto mb-5 text-3xl">
            🔑
          </div>

          <h1 className="text-2xl font-extrabold text-[#FAFAFA] text-center mb-2">
            Forgot password?
          </h1>
          <p className="text-[14px] text-[oklch(0.708_0_0)] text-center mb-6">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {sent ? (
            <div className="p-4 rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-center">
              <p className="text-emerald-400 font-semibold m-0">
                ✓ Reset link sent!
              </p>
              <p className="text-emerald-500/80 text-[13px] mt-1.5 m-0">
                Check your inbox at <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="fp-email" className="text-[13px] font-semibold text-[#FAFAFA]">
                  Email address
                </label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="px-3.5 py-2.5 rounded-[10px] border border-white/15 bg-[oklch(0.145_0_0)] text-[#FAFAFA] text-[15px] outline-none transition-colors duration-200 focus:border-[#FF6B2B] w-full"
                />
              </div>

              {error && (
                <div className="px-3.5 py-2.5 rounded-[10px] bg-red-500/10 border border-red-500/30 text-[#FCA5A5] text-[13px]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full py-3.5 rounded-[14px] border-none text-white text-[15px] font-bold transition-opacity duration-200 ${
                  loading || !email
                    ? "bg-[oklch(0.269_0_0)] cursor-not-allowed opacity-60"
                    : "bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] cursor-pointer hover:opacity-90"
                }`}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="text-center text-[13px] text-[oklch(0.708_0_0)] mt-5">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#FF6B2B] font-semibold no-underline hover:opacity-80 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
