"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LS_AUTH_KEY, LS_USER_KEY } from "@/lib/constants";
import { api } from "@/services/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(LS_AUTH_KEY);
    const storedUser = localStorage.getItem(LS_USER_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    // Otimista: usa o usuário em cache enquanto revalida o token no backend.
    if (storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    api
      .get<User>("/auth/me")
      .then((freshUser) => {
        setToken(storedToken);
        setUser(freshUser);
        localStorage.setItem(LS_USER_KEY, JSON.stringify(freshUser));
      })
      .catch(() => {
        // Token inválido/expirado (api.ts já limpou o token do storage).
        localStorage.removeItem(LS_USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistSession = useCallback((auth: AuthResponse) => {
    localStorage.setItem(LS_AUTH_KEY, auth.access_token);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(auth.user));
    setToken(auth.access_token);
    setUser(auth.user);
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      const auth = await api.post<AuthResponse>("/auth/login", data);
      persistSession(auth);
    },
    [persistSession],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const auth = await api.post<AuthResponse>("/auth/register", data);
      persistSession(auth);
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(LS_AUTH_KEY);
    localStorage.removeItem(LS_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
