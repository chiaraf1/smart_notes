import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import "./App.css";

function AppRouter() {
  const { token } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (token) return <DashboardPage />;
  if (showAuth) return <AuthPage />;
  return <LandingPage onGetStarted={() => setShowAuth(true)} onLogin={() => setShowAuth(true)} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
