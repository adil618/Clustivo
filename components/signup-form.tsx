"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Star, Lock } from "lucide-react";
import {
  checkUsernameAvailable,
  checkEmailAvailable,
  signup,
} from "@/services/auth";
import { getAvatars } from "@/services/avatar";
import { getInterests } from "@/services/interest";
import { getCities } from "@/services/city";
import { getAreas } from "@/services/area";
import { Avatar } from "@/types/avatar";
import { Interest } from "@/types/interest";
import { City } from "@/types/city";
import { Area } from "@/types/area";

// ─── Discovery ranges ──────────────────────────────────────────────────────────
const DISCOVERY_RANGES = [
  { km: 2, label: "My neighbourhood" },
  { km: 5, label: "My area" },
  { km: 15, label: "My city" },
  { km: 30, label: "Greater metro" },
  { km: 50, label: "My region" },
  { km: 100, label: "My state/province" },
];

// ─── Step progress bar ─────────────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-1 rounded-sm transition-colors duration-300 ${i < current ? "bg-[#FF6B2B]" : "bg-white/10"
            }`}
        />
      ))}
    </div>
  );
}

// ─── Reusable Input ────────────────────────────────────────────────────────────
function Input({
  label, type = "text", id, value, onChange,
  placeholder, required, hint, error,
}: {
  label: string;
  type?: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#FAFAFA]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3.5 py-2.5 rounded-[10px] border text-[15px] text-[#FAFAFA] bg-[oklch(0.145_0_0)] outline-none transition-colors duration-200 focus:border-[#FF6B2B] box-border ${error ? "border-red-500" : "border-white/15"
          }`}
      />
      {error && <span className="text-[12px] text-red-400">{error}</span>}
      {hint && !error && <span className="text-[12px] text-[oklch(0.708_0_0)]">{hint}</span>}
    </div>
  );
}

// ─── Gradient button ───────────────────────────────────────────────────────────
function GradientBtn({
  children, onClick, disabled, type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-[15px] rounded-[14px] border-none text-white text-[16px] font-bold tracking-wide transition-opacity duration-200 ${disabled
          ? "bg-[oklch(0.269_0_0)] cursor-not-allowed"
          : "bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] cursor-pointer hover:opacity-90 active:scale-[0.99]"
        }`}
    >
      {children}
    </button>
  );
}

// ─── Select field ──────────────────────────────────────────────────────────────
function SelectField({
  id, label, value, onChange, options,
  placeholder = "Select…", required, disabled,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#FAFAFA]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-[10px] border border-white/15 text-[15px] outline-none appearance-none transition-colors duration-200 focus:border-[#FF6B2B] box-border ${disabled
            ? "bg-[oklch(0.18_0_0)] cursor-not-allowed text-[oklch(0.556_0_0)]"
            : "bg-[oklch(0.145_0_0)] cursor-pointer"
          } ${value ? "text-[#FAFAFA]" : "text-[oklch(0.556_0_0)]"}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── STEP 1 — Account details ──────────────────────────────────────────────────
function StepAccount({
  onNext,
}: {
  onNext: (data: {
    username: string; email: string; fullName: string; password: string;
    dob: string; cityId: string; areaId: string;
  }) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");

  const [cities, setCities] = useState<City[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load cities + all areas once on mount
  useEffect(() => {
    getCities().then(setCities).catch(console.error);
    getAreas().then(setAllAreas).catch(console.error);
  }, []);

  // Filter areas whenever city selection changes
  useEffect(() => {
    if (!cityId) { setAreas([]); setAreaId(""); return; }
    const selectedCity = cities.find(c => String(c.id ?? c._id) === String(cityId));
    setAreas(
      allAreas.filter((area) => {
        const matchById = String(area.cityId) === String(cityId) || String(area.city?.id) === String(cityId);
        const matchByName = selectedCity && area.city?.name && area.city.name.toLowerCase() === selectedCity.name.toLowerCase();
        return matchById || matchByName;
      })
    );
    setAreaId("");
  }, [cityId, allAreas, cities]);

  // Debounced username availability
  useEffect(() => {
    if (username.length < 3) { setUsernameError(""); return; }
    const t = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailable(username);
        const available = res.data?.available ?? (res as unknown as { available?: boolean }).available ?? true;
        setUsernameError(available ? "" : "Username is already taken");
      } catch { /* silently ignore */ }
    }, 600);
    return () => clearTimeout(t);
  }, [username]);

  // Debounced email availability
  useEffect(() => {
    if (!email.includes("@")) { setEmailError(""); return; }
    const t = setTimeout(async () => {
      try {
        const res = await checkEmailAvailable(email);
        const available = res.data?.available ?? (res as unknown as { available?: boolean }).available ?? true;
        setEmailError(available ? "" : "Email is already registered");
      } catch { /* silently ignore */ }
    }, 600);
    return () => clearTimeout(t);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setFormError("Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }
    if (!dob) { setFormError("Date of birth is required"); return; }
    if (usernameError || emailError) return;
    setLoading(true);
    try {
      onNext({ username, email, fullName, password, dob, cityId, areaId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold text-[#FAFAFA] m-0">
          Create your account
        </h1>
        <p className="text-[14px] text-[oklch(0.708_0_0)] mt-1">
          Join Clustivo and find people who share your interests.
        </p>
      </div>

      <Input id="fullName" label="Full Name" value={fullName} onChange={setFullName} placeholder="John Doe" required />
      <Input
        id="username" label="Username" value={username} onChange={setUsername}
        placeholder="johndoe" required error={usernameError}
        hint={username.length >= 3 && !usernameError ? "✓ Available" : ""}
      />
      <Input
        id="email" label="Email" type="email" value={email} onChange={setEmail}
        placeholder="you@example.com" required error={emailError}
        hint={email.includes("@") && !emailError ? "✓ Available" : ""}
      />
      <Input
        id="password" label="Password" type="password" value={password} onChange={setPassword}
        placeholder="Min. 8 characters" required hint="Must be at least 8 characters"
      />
      <Input id="dob" label="Date of Birth" type="date" value={dob} onChange={setDob} placeholder="MM/DD/YYYY" required />

      <SelectField
        id="cityId" label="City" value={cityId} onChange={setCityId}
        placeholder="Select your city…" required
        options={cities.map((c) => ({ value: String(c.id ?? c._id), label: c.name }))}
      />
      <SelectField
        id="areaId" label="Area" value={areaId} onChange={setAreaId}
        placeholder={!cityId ? "Select a city first…" : areas.length === 0 ? "No areas available for this city" : "Select your area…"}
        disabled={!cityId || areas.length === 0}
        options={areas.map((a) => ({ value: String(a.id ?? a._id), label: a.name }))}
      />

      {formError && (
        <div className="px-3.5 py-2.5 rounded-[10px] bg-red-500/10 border border-red-500/30 text-[#FCA5A5] text-[13px]">
          {formError}
        </div>
      )}

      <GradientBtn type="submit" disabled={loading || !!usernameError || !!emailError}>
        {loading ? "Checking…" : "Continue →"}
      </GradientBtn>

      <p className="text-center text-[13px] text-[oklch(0.708_0_0)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#FF6B2B] font-semibold no-underline hover:opacity-80 transition-opacity">
          Sign in
        </Link>
      </p>
    </form>
  );
}

// ─── STEP 2 — Pick avatar ──────────────────────────────────────────────────────
function StepAvatar({ onNext, onBack }: { onNext: (avatarId: string) => void; onBack: () => void }) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvatars().then(setAvatars).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold text-[#FAFAFA] m-0">
          Pick your Profile Pic or Avatar
        </h1>
        <p className="text-[14px] text-[oklch(0.708_0_0)] mt-1">
          How you appear to people nearby
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[oklch(0.708_0_0)]">Loading avatars…</div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
          {/* Upload placeholder */}
          <button
            type="button"
            onClick={() => setSelected("upload")}
            className={`aspect-square rounded-[14px] border-2 flex items-center justify-center text-[22px] cursor-pointer transition-all duration-150 ${selected === "upload"
                ? "border-[#FF6B2B] bg-[rgba(255,107,43,0.12)]"
                : "border-white/15 bg-[oklch(0.18_0_0)] hover:border-[#FF6B2B]/50"
              }`}
          >
            +
          </button>

          {avatars.map((av) => (
            <button
              key={av.id}
              type="button"
              onClick={() => setSelected(av.id)}
              className={`aspect-square rounded-[14px] border-[2.5px] flex items-center justify-center overflow-hidden cursor-pointer p-0.5 transition-all duration-150 ${selected === av.id
                  ? "border-[#FF6B2B] bg-[rgba(255,107,43,0.12)]"
                  : "border-white/15 bg-[oklch(0.18_0_0)] hover:border-[#FF6B2B]/50"
                }`}
            >
              <Image
                src={av.url}
                alt="avatar"
                width={56}
                height={56}
                className="rounded-[10px] object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <GradientBtn onClick={() => onNext(selected)} disabled={!selected}>
        Continue →
      </GradientBtn>
      <button
        type="button"
        onClick={onBack}
        className="bg-transparent border-none text-[oklch(0.708_0_0)] text-[14px] cursor-pointer hover:text-[#FAFAFA] transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

// ─── STEP 3 — Pick interests ───────────────────────────────────────────────────
const MIN_INTERESTS = 3;

function StepInterests({ onNext, onBack }: { onNext: (ids: string[]) => void; onBack: () => void }) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInterests().then(setInterests).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);


  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold text-[#FAFAFA] m-0">
          What do you love?
        </h1>
        <p className={`text-[14px] mt-1 font-semibold ${selected.length >= MIN_INTERESTS ? "text-[#FF6B2B]" : "text-red-400"}`}>
          {selected.length} selected{" "}
          {selected.length < MIN_INTERESTS ? `(need at least ${MIN_INTERESTS})` : "✓"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[oklch(0.708_0_0)]">Loading interests…</div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto">
          {interests.map((interest) => {
            const active = selected.includes(interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggle(interest.id)}
                className={`rounded-[14px] border-2 px-2 py-3.5 flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-150 ${active
                    ? "border-[#FF6B2B] bg-[rgba(255,107,43,0.12)] scale-[1.03]"
                    : "border-white/15 bg-[oklch(0.18_0_0)] hover:border-[#FF6B2B]/50"
                  }`}
              >
                {interest.icon ? (
                  <Image
                    src={interest.icon}
                    alt={interest.name}
                    width={36}
                    height={36}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                )}
                <span className="text-[12px] font-semibold text-[#FAFAFA]">
                  {interest.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <GradientBtn onClick={() => onNext(selected)} disabled={selected.length < MIN_INTERESTS}>
        Continue →
      </GradientBtn>
      <button
        type="button"
        onClick={onBack}
        className="bg-transparent border-none text-[oklch(0.708_0_0)] text-[14px] cursor-pointer hover:text-[#FAFAFA] transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

// ─── STEP 4 — Discovery range ──────────────────────────────────────────────────
function StepDiscovery({
  onFinish, onBack, submitting,
}: {
  onFinish: (km: number) => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const [selected, setSelected] = useState<number>(5);

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <h1 className="text-[26px] font-extrabold text-[#FAFAFA] m-0">
          How far should we look?
        </h1>
        <p className="text-[14px] text-[oklch(0.708_0_0)] mt-1">
          Find people within this distance who share your interests.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {DISCOVERY_RANGES.map((r) => {
          const active = selected === r.km;
          return (
            <button
              key={r.km}
              type="button"
              onClick={() => setSelected(r.km)}
              className={`rounded-[14px] border-2 px-[18px] py-3.5 flex items-center justify-between cursor-pointer transition-all duration-150 text-left ${active
                  ? "border-[#FF6B2B] bg-[rgba(255,107,43,0.10)]"
                  : "border-white/15 bg-[oklch(0.18_0_0)] hover:border-[#FF6B2B]/50"
                }`}
            >
              <div>
                <div className="font-bold text-[15px] text-[#FAFAFA]">{r.km} km</div>
                <div className="text-[13px] text-[oklch(0.708_0_0)]">{r.label}</div>
              </div>
              {active && (
                <span className="w-[22px] h-[22px] rounded-full bg-[#FF6B2B] flex items-center justify-center text-white text-[13px]">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Privacy note */}
      <div className="px-3.5 py-3 rounded-[12px] bg-[rgba(255,107,43,0.08)] border border-[rgba(255,107,43,0.25)] flex gap-2.5 items-start text-[13px] text-[#FDBA74]">
        <Lock className="w-4 h-4 shrink-0 text-[#FF6B2B] mt-0.5" />
        <span>Your location is private. People only see approximate distance.</span>
      </div>

      <GradientBtn onClick={() => onFinish(selected)} disabled={submitting}>
        {submitting ? "Creating account…" : "Find My People"}
      </GradientBtn>
      <button
        type="button"
        onClick={onBack}
        className="bg-transparent border-none text-[oklch(0.708_0_0)] text-[14px] cursor-pointer hover:text-[#FAFAFA] transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

// ─── Root multi-step component ─────────────────────────────────────────────────
export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [globalError, setGlobalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [accountData, setAccountData] = useState<{
    username: string; email: string; fullName: string; password: string;
  } | null>(null);
  const [avatarId, setAvatarId] = useState("");
  const [interestIds, setInterestIds] = useState<string[]>([]);
  const [extraData, setExtraData] = useState<{ dob: string; cityId: string; areaId: string }>({
    dob: "", cityId: "", areaId: "",
  });

  const handleAccountNext = (data: NonNullable<typeof accountData> & { dob: string; cityId: string; areaId: string }) => {
    const { dob, cityId, areaId, ...rest } = data;
    setAccountData(rest as typeof accountData);
    setExtraData({ dob, cityId, areaId });
    setStep(2);
  };

  const handleAvatarNext = (id: string) => { setAvatarId(id); setStep(3); };
  const handleInterestsNext = (ids: string[]) => { setInterestIds(ids); setStep(4); };

  const handleFinish = async (km: number) => {
    if (!accountData) return;
    setSubmitting(true);
    setGlobalError("");
    try {
      const res = await signup({
        username: accountData.username,
        email: accountData.email,
        password: accountData.password,
        fullName: accountData.fullName,
        ...(extraData.dob ? { dateOfBirth: extraData.dob } : {}),
        ...(extraData.cityId ? { cityId: extraData.cityId } : {}),
        ...(extraData.areaId ? { areaId: extraData.areaId } : {}),
        ...(avatarId && avatarId !== "upload" ? { avatarId } : {}),
        ...(interestIds.length ? { interestIds } : {}),
        discoveryRange: km,
      } as Parameters<typeof signup>[0]);

      const token = res?.data?.token ?? res?.data?.accessToken ?? res?.token ?? res?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `auth-token=${token}; path=/; SameSite=Strict`;
      }
      if (accountData.email) {
        sessionStorage.setItem("verify_email", accountData.email);
      }
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any)?.response?.data?.message || "Registration failed. Please try again.";
      setGlobalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh bg-[oklch(0.145_0_0)] flex items-center justify-center px-4 py-6 font-sans">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FF6B2B] to-[#FF3D7F] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-[22px] font-extrabold text-[#FF6B2B] tracking-tight">
            Clustivo
          </span>
        </div>

        {/* Progress */}
        <div className="mb-1.5">
          <StepBar current={step} total={4} />
          <p className="text-[12px] text-[oklch(0.708_0_0)] m-0">Step {step} of 4</p>
        </div>

        {/* Card */}
        <div className="bg-[oklch(0.205_0_0)] rounded-[20px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] mt-3 border border-white/10">
          {globalError && (
            <div className="mb-3.5 px-3.5 py-2.5 rounded-[10px] bg-red-500/10 border border-red-500/30 text-[#FCA5A5] text-[13px]">
              {globalError}
            </div>
          )}

          {step === 1 && <StepAccount onNext={handleAccountNext} />}
          {step === 2 && <StepAvatar onNext={handleAvatarNext} onBack={() => setStep(1)} />}
          {step === 3 && <StepInterests onNext={handleInterestsNext} onBack={() => setStep(2)} />}
          {step === 4 && <StepDiscovery onFinish={handleFinish} onBack={() => setStep(3)} submitting={submitting} />}
        </div>

        {/* ToS */}
        <p className="text-center text-[12px] text-[oklch(0.708_0_0)] mt-4">
          By continuing you agree to our{" "}
          <Link href="#" className="text-[#FF6B2B] no-underline hover:opacity-80 transition-opacity">Terms</Link>
          {" & "}
          <Link href="#" className="text-[#FF6B2B] no-underline hover:opacity-80 transition-opacity">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
