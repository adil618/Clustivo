"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/auth";
import { Users, Lock } from "lucide-react";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.message ?? "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Lock icon */}
      <div className="text-center">
        <div className="w-[72px] h-[72px] rounded-full bg-[rgba(255,107,43,0.12)] border-2 border-[#FF6B2B] inline-flex items-center justify-center mb-3.5">
          <Lock className="w-8 h-8 text-[#FF6B2B]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA] mb-1.5">
          Set new password
        </h1>
        <p className="text-[14px] text-[oklch(0.708_0_0)]">
          Choose a strong password for your account.
        </p>
      </div>

      {success ? (
        <div className="p-4 rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p className="text-emerald-400 font-semibold m-0">✓ Password reset successfully!</p>
          <p className="text-emerald-500/80 text-[13px] mt-1.5">Redirecting to login…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {!token && (
            <div className="px-3.5 py-2.5 rounded-[10px] bg-red-500/10 border border-red-500/30 text-[#FCA5A5] text-[13px]">
              Invalid or missing reset token. Please use the link from your email.
            </div>
          )}

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="rp-new" className="text-[13px] font-semibold text-[#FAFAFA]">
              New Password
            </label>
            <input
              id="rp-new"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              className="px-3.5 py-2.5 rounded-[10px] border border-white/15 bg-[oklch(0.145_0_0)] text-[#FAFAFA] text-[15px] outline-none transition-colors duration-200 focus:border-[#FF6B2B] w-full"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="rp-confirm" className="text-[13px] font-semibold text-[#FAFAFA]">
              Confirm Password
            </label>
            <input
              id="rp-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
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
            disabled={loading || !token}
            className={`w-full py-3.5 rounded-[14px] border-none text-white text-[15px] font-bold transition-opacity duration-200 ${
              loading || !token
                ? "bg-[oklch(0.269_0_0)] cursor-not-allowed opacity-60"
                : "bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] cursor-pointer hover:opacity-90"
            }`}
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      )}

      <p className="text-center text-[13px] text-[oklch(0.708_0_0)]">
        <Link
          href="/login"
          className="text-[#FF6B2B] font-semibold no-underline hover:opacity-80 transition-opacity"
        >
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-svh bg-[oklch(0.145_0_0)] flex items-center justify-center px-4 py-6 font-sans">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-[22px] font-extrabold text-[#FF6B2B] tracking-tight">
            Clustivo
          </span>
        </div>
        {/* Card */}
        <div className="bg-[oklch(0.205_0_0)] rounded-[20px] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10">
          <Suspense fallback={<p className="text-center text-[oklch(0.708_0_0)]">Loading…</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
