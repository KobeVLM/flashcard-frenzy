import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../api/authService';
import type { User, AuthData, ApiResponse } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<AuthData>>;
  register: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<ApiResponse<AuthData>>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setInitialized(true);
  }, []);

  const persistAuth = useCallback((data: AuthData) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        persistAuth(response.data);
      }
      return response;
    },
    [persistAuth]
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      confirmPassword: string
    ) => {
      const response = await authService.register({
        fullName,
        email,
        password,
        confirmPassword,
      });
      if (response.success && response.data) {
        persistAuth(response.data);
      }
      return response;
    },
    [persistAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Silent fail — still clear local state
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  if (!initialized) {
    return null; // Don't render until rehydrated
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
