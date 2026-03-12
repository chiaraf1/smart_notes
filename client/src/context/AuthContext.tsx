import { createContext, useContext, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type AuthContextValue = {
  token: string | null;
  userEmail: string | null;
  authHeader: () => HeadersInit;
  login: (email: string, password: string, mode: "login" | "register") => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    () => localStorage.getItem("userEmail")
  );

  function authHeader(): HeadersInit {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function login(email: string, password: string, mode: "login" | "register") {
    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const r = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error ?? "Authentication failed");
    }
    const data: { token: string; email: string } = await r.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.email);
    setToken(data.token);
    setUserEmail(data.email);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, userEmail, authHeader, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
