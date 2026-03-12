import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password, authMode);
    } catch (e: any) {
      setError(e?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authLayout">
      <div className="authCard">
        <div className="authLogo">Smart Notes</div>
        <h1 className="authTitle">
          {authMode === "login" ? "Welcome back" : "Create account"}
        </h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="authField">
            <label className="authLabel" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              className="authInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="authField">
            <label className="authLabel" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="authInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={authMode === "register" ? "At least 6 characters" : ""}
              autoComplete={authMode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading
              ? "Please wait…"
              : authMode === "login"
              ? "Log in"
              : "Create account"}
          </button>
        </form>

        <div className="authSwitch">
          {authMode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                className="authLink"
                onClick={() => { setAuthMode("register"); setError(""); }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="authLink"
                onClick={() => { setAuthMode("login"); setError(""); }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
