import { useState } from "react";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";

export default function Layout({ children }) {
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6", // light gray
        padding: 20
      }}
    >
      {!children && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setAuthMode("login")}
            style={{
              marginRight: 10,
              padding: "8px 16px",
              borderRadius: 6,
              border: authMode === "login" ? "2px solid #4f46e5" : "1px solid #d1d5db",
              backgroundColor: authMode === "login" ? "#e0e7ff" : "#fff",
              cursor: "pointer"
            }}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode("signup")}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: authMode === "signup" ? "2px solid #4f46e5" : "1px solid #d1d5db",
              backgroundColor: authMode === "signup" ? "#e0e7ff" : "#fff",
              cursor: "pointer"
            }}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Show Auth Forms */}
      {!children && authMode === "login" && <LoginForm />}
      {!children && authMode === "signup" && <SignupForm />}

      {/* Show Profile Builder */}
      {children && children}
    </div>
  );
}
