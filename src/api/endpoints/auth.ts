import { apiRequest } from '../client';
import type { AuthTokens, AuthUser, LoginPayload, RegisterPayload } from '../../types/auth.types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthTokens>('/auth/login', { method: 'POST', body: payload }),

  register: (payload: RegisterPayload) =>
    apiRequest<AuthUser>('/auth/register', { method: 'POST', body: payload }),

  refreshToken: (refreshToken: string) =>
    apiRequest<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    }),

  logout: (token: string) =>
    apiRequest<void>('/auth/logout', { method: 'POST', token }),
};
