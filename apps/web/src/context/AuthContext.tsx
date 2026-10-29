'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  firstName?: string | null;
  lastName?: string | null;
  preferredLanguage?: string | null;
  targetAusbildungField?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
  roles?: string[];
  profile?: UserProfile | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  displayName: string;
  initials: string;
  setAuthSession: (user: AuthUser, accessToken: string) => void;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const ACCESS_TOKEN_KEY = 'ausbildung_access_token';
const USER_STORAGE_KEY = 'ausbildung_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function computeDisplayName(user: AuthUser | null): string {
  if (!user) return '';
  const first = user.profile?.firstName?.trim() || '';
  const last = user.profile?.lastName?.trim() || '';
  const fullName = `${first} ${last}`.trim();
  if (fullName) return fullName;
  if (user.email) {
    return user.email.split('@')[0];
  }
  return 'Candidate';
}

function computeInitials(user: AuthUser | null): string {
  const name = computeDisplayName(user);
  if (!name) return 'U';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAuthSession = useCallback((nextUser: AuthUser, nextToken: string) => {
    setUser(nextUser);
    setAccessToken(nextToken);
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, nextToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const fetchCurrentUser = useCallback(
    async (tokenToUse: string): Promise<AuthUser | null> => {
      try {
        const res = await fetch('/api/v1/users/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            Accept: 'application/json',
          },
          cache: 'no-store',
        });

        if (res.status === 401) {
          clearSession();
          return null;
        }

        if (!res.ok) {
          return null;
        }

        const body = await res.json().catch(() => null);
        const meData: AuthUser | null = body?.data || body;
        if (meData && meData.id && meData.email) {
          setUser(meData);
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(meData));
          } catch {
            // Ignore
          }
          return meData;
        }
        return null;
      } catch {
        return null;
      }
    },
    [clearSession],
  );

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const storedUserRaw = localStorage.getItem(USER_STORAGE_KEY);

        if (storedUserRaw) {
          try {
            const parsedUser = JSON.parse(storedUserRaw);
            if (mounted && parsedUser?.email) {
              setUser(parsedUser);
            }
          } catch {
            // Ignore malformed JSON
          }
        }

        if (storedToken) {
          if (mounted) {
            setAccessToken(storedToken);
          }
          await fetchCurrentUser(storedToken);
        }
      } catch {
        // Ignore localStorage access errors
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, [fetchCurrentUser]);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    const token =
      accessToken ||
      (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null);
    if (!token) return null;
    return fetchCurrentUser(token);
  }, [accessToken, fetchCurrentUser]);

  const logout = useCallback(async () => {
    const token =
      accessToken ||
      (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null);
    try {
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession();
      router.push('/auth/login');
    }
  }, [accessToken, clearSession, router]);

  const displayName = computeDisplayName(user);
  const initials = computeInitials(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user && accessToken),
        isLoading,
        displayName,
        initials,
        setAuthSession,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

