/**
 * useAuth — Global authentication context
 *
 * Provides: user state, login, register (all 7 steps), logout.
 * Persists access_token + refresh_token + user in AsyncStorage.
 * Hydrates on first mount so the app knows if a session already exists.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi } from '@/src/api/endpoints/auth';
import type { AuthUser, RegisterPayload } from '@/src/types/auth.types';

// ── Storage keys ─────────────────────────────────────────────────────────────

const KEY_ACCESS  = 'access_token';
const KEY_REFRESH = 'refresh_token';
const KEY_USER    = 'auth_user';

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthState {
  user:        AuthUser | null;
  accessToken: string   | null;
  isLoading:   boolean;
  isSignedIn:  boolean;
  login:    (email: string, password: string)  => Promise<void>;
  register: (payload: RegisterPayload)          => Promise<void>;
  logout:   ()                                  => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,        setUser       ] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string  | null>(null);
  const [isLoading,   setIsLoading  ] = useState(true);

  // ── Hydrate from storage on mount ─────────────────────────────────────────
  useEffect(() => {
    async function hydrate() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(KEY_ACCESS),
          AsyncStorage.getItem(KEY_USER),
        ]);
        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser) as AuthUser);
        }
      } catch {
        // storage read failed — treat as logged out
      } finally {
        setIsLoading(false);
      }
    }
    void hydrate();
  }, []);

  // ── Persist tokens + user ─────────────────────────────────────────────────
  const persist = useCallback(async (
    access:   string,
    refresh:  string,
    authUser: AuthUser,
  ) => {
    await Promise.all([
      AsyncStorage.setItem(KEY_ACCESS,  access),
      AsyncStorage.setItem(KEY_REFRESH, refresh),
      AsyncStorage.setItem(KEY_USER,    JSON.stringify(authUser)),
    ]);
    setAccessToken(access);
    setUser(authUser);
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login({ email, password });
    const me     = await authApi.me(tokens.accessToken);
    await persist(tokens.accessToken, tokens.refreshToken, me);
  }, [persist]);

  // ── Register — sends all 7 steps to the backend in one request ────────────
  const register = useCallback(async (payload: RegisterPayload) => {
    const tokens = await authApi.register(payload);
    const me     = await authApi.me(tokens.accessToken);
    await persist(tokens.accessToken, tokens.refreshToken, me);
  }, [persist]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (accessToken) {
      try { await authApi.logout(accessToken); } catch { /* best-effort */ }
    }
    await Promise.all([
      AsyncStorage.removeItem(KEY_ACCESS),
      AsyncStorage.removeItem(KEY_REFRESH),
      AsyncStorage.removeItem(KEY_USER),
    ]);
    setAccessToken(null);
    setUser(null);
  }, [accessToken]);

  const value: AuthState = {
    user,
    accessToken,
    isLoading,
    isSignedIn: !!user && !!accessToken,
    login,
    register,
    logout,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
