import React, { useEffect, useState } from "react";
import { ProfileProvider, useProfile } from "./context/AppContext";
import ProfileLayout from "./Layout/ProfileLayout";
import AuthLayout from "./Layout/AuthLayout";
import StepProgress from "./components/steps/StepProgress";
import PersonalStep from "./components/steps/PersonalStep";
import ExperienceStep from "./components/steps/ExperienceStep";
import SkillsStep from "./components/steps/SkillsStep";
import ReviewStep from "./components/steps/ReviewStep";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import JobDashboard from "./pages/JobDashboard";
import Applications from "./pages/Application"; // Ensure filename is Application.jsx
import SuccessStep from "./components/steps/SuccessStep";
import api from "./utils/api";

export default function App() {
  return (
    <ProfileProvider>
      <MainApp />
    </ProfileProvider>
  );
}

function MainApp() {
  const { state, dispatch } = useProfile();
  const [authMode, setAuthMode] = useState("login");
  const [isInitializing, setIsInitializing] = useState(true);
  
  // State to toggle between Dashboard and Full Tracker
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/profile");
          dispatch({ type: "SET_PROFILE", payload: res.data.profile || res.data });
          dispatch({ type: "LOGIN_SUCCESS" });

          // Auto-redirect to dashboard if profile is complete
          if (res.data.profile?.skills?.length > 0 || res.data.skills?.length > 0) {
            dispatch({ type: "SET_STEP", payload: 6 });
          }
        } catch (err) {
          console.error("Auth init failed:", err);
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [dispatch]);

  const handleEditProfile = () => dispatch({ type: "SET_STEP", payload: 1 });

  if (isInitializing) return <div className="loader">Loading Application...</div>;

  // 1. Auth Screens
  if (!state.isAuthenticated) {
    return (
      <AuthLayout>
        {authMode === "login" ? (
          <LoginForm
            onLogin={(profileData, token) => {
              localStorage.setItem("token", token);
              dispatch({ type: "SET_PROFILE", payload: profileData });
              dispatch({ type: "LOGIN_SUCCESS" });
              dispatch({ type: "SET_STEP", payload: 1 });
            }}
            switchToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <SignupForm
            onSignup={(profileData, token) => {
              localStorage.setItem("token", token);
              dispatch({ type: "SET_PROFILE", payload: profileData });
              dispatch({ type: "LOGIN_SUCCESS" });
              dispatch({ type: "SET_STEP", payload: 1 });
            }}
            switchToLogin={() => setAuthMode("login")}
          />
        )}
      </AuthLayout>
    );
  }

  // 2. Dashboard & Application Tracker Logic (Step 6)
  if (state.step === 6) {
    return (
      <>
        {activeView === "dashboard" ? (
          <JobDashboard 
            onEdit={handleEditProfile} 
            onViewApps={() => setActiveView("tracker")} // Standardized prop name
          />
        ) : (
          <Applications 
            onBack={() => setActiveView("dashboard")} 
          />
        )}
      </>
    );
  }

  // 3. Onboarding Steps (1-5)
  return (
    <ProfileLayout>
      <main style={{ marginTop: "2rem" }}>
        {state.step === 1 && <PersonalStep />}
        {state.step === 2 && <SkillsStep />}
        {state.step === 3 && <ExperienceStep />}
        {state.step === 4 && <ReviewStep />}
        {state.step === 5 && <SuccessStep />}
      </main>
    </ProfileLayout>
  );
}