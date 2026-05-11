"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { resendVerification } from "@/services/auth";

const STEPS = [
  "Open your email inbox",
  "Find the email from Clustivo",
  'Click "Activate Account" button',
  "Come back and sign in",
];

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("verify_email") ?? "";
    setEmail(stored);
  }, []);

  const handleResend = async () => {
    if (!email) return;
    setSending(true);
    setError("");
    setSent(false);
    try {
      await resendVerification({ email });
      setSent(true);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.message ?? "Failed to resend. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-svh bg-[oklch(0.145_0_0)] flex items-center justify-center px-4 py-6 font-sans">
      <div className="w-full max-w-[420px] text-center">
        {/* Envelope icon */}
        <div className="w-[88px] h-[88px] rounded-full border-2 border-[#FF6B2B] bg-[rgba(255,107,43,0.12)] flex items-center justify-center mx-auto mb-5">
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF6B2B"
            strokeWidth="1.5"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h1 className="text-[26px] font-extrabold text-[#FAFAFA] mb-2.5">
          Verify your email
        </h1>
        <p className="text-[14px] text-[oklch(0.708_0_0)] mb-1">
          We&apos;ve sent an activation link to
        </p>
        <p className="text-[15px] font-bold text-[#FAFAFA] mb-2">
          {email || "your email address"}
        </p>
        <p className="text-[13px] text-[oklch(0.708_0_0)] mb-6">
          Click the link in the email to activate your account.
        </p>

        {/* Steps card */}
        <div className="bg-[oklch(0.205_0_0)] rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.4)] mb-6 border border-white/10">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3.5 px-5 py-3.5 text-left ${
                i < STEPS.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#FF6B2B] text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <span className="text-[14px] text-[#FAFAFA]">{step}</span>
            </div>
          ))}
        </div>

        {/* Resend */}
        {error && (
          <p className="text-[13px] text-red-400 mb-2">{error}</p>
        )}
        {sent && (
          <p className="text-[13px] text-emerald-400 mb-2">
            ✓ Verification email resent!
          </p>
        )}
        <button
          onClick={handleResend}
          disabled={sending}
          className={`bg-transparent border-none text-[#FF6B2B] font-bold text-[14px] underline mb-2 ${
            sending ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"
          } transition-opacity`}
        >
          {sending ? "Sending…" : "Didn't receive the email? Resend"}
        </button>

        <p className="text-[12px] text-[oklch(0.708_0_0)] mb-6">
          Check your spam / junk folder if you don&apos;t see it.
        </p>

        {/* Sign in button */}
        <Link
          href="/login"
          className="block w-full py-[15px] rounded-[14px] border-2 border-[#FF6B2B] bg-transparent text-[#FF6B2B] text-[15px] font-bold no-underline text-center transition-all duration-200 hover:bg-[rgba(255,107,43,0.1)] box-border"
        >
          Already verified? Sign in
        </Link>
      </div>
    </div>
  );
}
