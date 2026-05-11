"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ username, password });
      const token = res?.token ?? res?.accessToken ?? res?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `auth-token=${token}; path=/; SameSite=Strict`;
      }
      const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
      router.replace(callbackUrl);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] flex items-center justify-center text-[22px]">
            🤝
          </div>
          <span className="text-2xl font-extrabold text-[#FF6B2B] tracking-tight">
            Clustivo
          </span>
        </div>

        {/* Card */}
        <div className="bg-[oklch(0.205_0_0)] rounded-[20px] px-7 py-8 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          <h1 className="text-[26px] font-extrabold text-[#FAFAFA] mb-1.5">
            Welcome back 👋
          </h1>
          <p className="text-sm text-[oklch(0.708_0_0)] mb-7">
            Sign in to your Clustivo account
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-[18px]">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-username" className="text-[13px] font-semibold text-[#FAFAFA]">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                autoComplete="username"
                className="px-3.5 py-[11px] rounded-[10px] border border-white/15 bg-[oklch(0.145_0_0)] text-[#FAFAFA] text-[15px] outline-none transition-colors duration-200 focus:border-[#FF6B2B] w-full"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-[13px] font-semibold text-[#FAFAFA]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] text-[#FF6B2B] no-underline font-medium hover:opacity-80 transition-opacity"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-[11px] pr-11 rounded-[10px] border border-white/15 bg-[oklch(0.145_0_0)] text-[#FAFAFA] text-[15px] outline-none transition-colors duration-200 focus:border-[#FF6B2B] box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[oklch(0.708_0_0)] text-base p-0.5 leading-none"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-3.5 py-2.5 rounded-[10px] bg-red-500/12 border border-red-500/30 text-[#FCA5A5] text-[13px]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-[13px] rounded-[12px] border-none text-white text-[15px] font-bold transition-opacity duration-200 ${
                loading
                  ? "bg-[oklch(0.269_0_0)] cursor-not-allowed"
                  : "bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] cursor-pointer hover:opacity-90"
              }`}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-[13px] text-[oklch(0.708_0_0)] mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#FF6B2B] font-semibold no-underline hover:opacity-80 transition-opacity">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-[12px] text-[oklch(0.556_0_0)] mt-5">
          By signing in you agree to our{" "}
          <Link href="#" className="text-[#FF6B2B] no-underline hover:opacity-80 transition-opacity">Terms</Link>
          {" & "}
          <Link href="#" className="text-[#FF6B2B] no-underline hover:opacity-80 transition-opacity">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
