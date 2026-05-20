import api from "@/lib/axios";
import {
  SignupPayload,
  LoginPayload,
  AuthResponse,
  AvailabilityResponse,
  ResendVerificationPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types/auth";

// ─── Availability Checks ──────────────────────────────────────────────────────

export const checkUsernameAvailable = async (
  username: string
): Promise<AvailabilityResponse> => {
  const res = await api.get<AvailabilityResponse>(
    process.env.NEXT_PUBLIC_AUTH_USERNAME_AVAILABLE || "/auth/username/available",
    { params: { username } }
  );
  return res.data;
};

export const checkEmailAvailable = async (
  email: string
): Promise<AvailabilityResponse> => {
  const res = await api.get<AvailabilityResponse>(
    process.env.NEXT_PUBLIC_AUTH_EMAIL_AVAILABLE || "/auth/email/available",
    { params: { email } }
  );
  return res.data;
};

// ─── Signup ───────────────────────────────────────────────────────────────────

export const signup = async (data: SignupPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>(
    process.env.NEXT_PUBLIC_AUTH_SIGNUP || "/auth/signup",
    data
  );
  return res.data;
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (
  data: LoginPayload
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>(
    process.env.NEXT_PUBLIC_AUTH_LOGIN || "/auth/login",
    data
  );
  return res.data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (): Promise<void> => {
  await api.post(process.env.NEXT_PUBLIC_AUTH_LOGOUT || "/auth/logout");
};

// ─── Resend Verification ──────────────────────────────────────────────────────

export const resendVerification = async (
  data: ResendVerificationPayload
): Promise<{ success: boolean; message: string }> => {
  const res = await api.post(
    process.env.NEXT_PUBLIC_AUTH_RESEND_VERIFICATION || "/auth/resend-verification",
    data
  );
  return res.data;
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (
  data: ForgotPasswordPayload
): Promise<{ success: boolean; message: string }> => {
  const res = await api.post(
    process.env.NEXT_PUBLIC_AUTH_FORGOT_PASSWORD || "/auth/forgot-password",
    data
  );
  return res.data;
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (
  data: ResetPasswordPayload
): Promise<{ success: boolean; message: string }> => {
  const res = await api.post(
    process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD || "/auth/reset-password",
    data
  );
  return res.data;
};
