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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/profile");
          dispatch({ type: "SET_PROFILE", payload: res.data.profile });
          dispatch({ type: "LOGIN_SUCCESS" });

          // Returning users with existing profiles go straight to the Dashboard
          if (res.data.profile.skills?.length > 0) {
            dispatch({ type: "SET_STEP", payload: 6 });
          }
        } catch (err) {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [dispatch]);

  const handleEditProfile = () => dispatch({ type: "SET_STEP", payload: 1 });

  if (isInitializing) return <div className="loader">Loading...</div>;

  // 1. Auth Logic
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

  // 2. Dashboard Logic (Now Step 6)
  if (state.step === 6) {
    return <JobDashboard user={state.profile} onEdit={handleEditProfile} />;
  }

  // 3. Multi-Step Onboarding Logic
  return (
    <ProfileLayout>
      
      <main style={{ marginTop: "2rem" }}>
        {state.step === 1 && <PersonalStep />}
        {state.step === 2 && <SkillsStep />}
        {state.step === 3 && <ExperienceStep />}
        {state.step === 4 && <ReviewStep />}
        
        {/* Step 5 is the bridge celebration screen */}
        {state.step === 5 && <SuccessStep />}
      </main>
    </ProfileLayout>
  );
}