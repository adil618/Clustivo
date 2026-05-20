export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    token?: string;
    accessToken?: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role?: string;
    };
  };
  token?: string;
  accessToken?: string;
}

export interface AvailabilityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: { available: boolean };
  available?: boolean;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
