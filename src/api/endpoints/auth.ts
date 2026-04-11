import { apiRequest } from '../client';
import type { AuthTokens, AuthUser, LoginPayload, RegisterPayload } from '../../types/auth.types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthTokens>('/auth/login', { method: 'POST', body: payload }),

  /** Backend returns tokens (not user) on register — same as login. */
  register: (payload: RegisterPayload) =>
    apiRequest<AuthTokens>('/auth/register', { method: 'POST', body: payload }),

  /** Fetch the authenticated user's profile. Requires a valid access token. */
  me: (token: string) =>
    apiRequest<AuthUser>('/auth/me', { token }),

  refreshToken: (refreshToken: string) =>
    apiRequest<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    }),

  logout: (token: string) =>
    apiRequest<void>('/auth/logout', { method: 'POST', token }),

  /** Send a 6-digit OTP to the user's email address. */
  sendOtp: (email: string, firstName?: string) =>
    apiRequest<{ expiresIn: number }>('/auth/send-otp', {
      method: 'POST',
      body: { email, firstName },
    }),

  /** Verify the OTP entered by the user. Throws on mismatch / expiry. */
  verifyOtp: (email: string, otp: string) =>
    apiRequest<{ verified: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: { email, otp },
    }),
};
