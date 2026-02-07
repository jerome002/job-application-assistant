import { createContext, useContext, useState } from "react";

/* 1️⃣ Create the context */
const AuthContext = createContext();

/* 2️⃣ Provider component */
export function AuthProvider({ children }) {
  // Is user authenticated?
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Which auth screen is active
  const [authMode, setAuthMode] = useState("login"); // login | signup

  /* 3️⃣ Auth actions */
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const switchToLogin = () => setAuthMode("login");
  const switchToSignup = () => setAuthMode("signup");

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        authMode,
        login,
        logout,
        switchToLogin,
        switchToSignup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* 4️⃣ Custom hook (VERY important) */
export function useAuth() {
  return useContext(AuthContext);
}
