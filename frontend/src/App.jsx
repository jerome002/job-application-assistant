import React, { useEffect } from "react";
import { ProfileProvider, useProfile } from "./context/AppContext";
import ProfileLayout from "./Layout/ProfileLayout";
import AuthLayout from "./Layout/AuthLayout";
import StepProgress from "./components/steps/StepProgress";
import PersonalStep from "./components/steps/PersonalStep";
import ExperienceStep from "./components/steps/ExperienceStep";
import SkillsStep from "./components/steps/SkillsStep";
import ReviewStep from "./components/steps/ReviewStep";
import Dashboard from "./dashboard/Dashboard";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import api from "./utils/api";
import JobDashboard from "./pages/JobDashboard";

export default function App() {
  return (
    <ProfileProvider>
      <MainApp />
    </ProfileProvider>
  );
}

function MainApp() {
  const { state, dispatch } = useProfile();
  const [authMode, setAuthMode] = React.useState("login");

  // --- ALL YOUR CRITICAL LOGIC REMAINS UNTOUCHED ---
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token && !state.profile.personal.first_name) {
        try {
          const res = await api.get("/profile"); 
          dispatch({ type: "LOAD_PROFILE", payload: res.data.profile });
        } catch (err) {
          console.error("Session expired");
          dispatch({ type: "LOGOUT" });
        }
      }
    };
    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem("currentStep", state.step);
    }
  }, [state.step, state.isAuthenticated]);

  useEffect(() => {
    if (!state.isAuthenticated || !state.profile.personal.first_name) return;
    const delayDebounceFn = setTimeout(async () => {
      try {
        await api.put("/profile/personal", { personal: state.profile.personal });
        console.log("Draft auto-saved to cloud...");
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 3000); 
    return () => clearTimeout(delayDebounceFn);
  }, [state.profile.personal, state.isAuthenticated]);

  // --- UPDATED RENDER STEP ---
  const renderStep = () => {
    switch (state.step) {
      case 1: return <PersonalStep />;
      case 2: return <SkillsStep />;
      case 3: return <ExperienceStep />;
      case 4: return <ReviewStep />; 
      case 5: return <JobDashboard user={state.profile} />
      default: return <JobDashboard/>;
    }
  };

  if (!state.isAuthenticated) {
    return (
      <AuthLayout>
        {authMode === "login" ? (
          <LoginForm
            onLogin={(profileData, token) => {
              localStorage.setItem("token", token);
              localStorage.setItem("profile", JSON.stringify(profileData));
              dispatch({ type: "LOAD_PROFILE", payload: profileData });
              dispatch({ type: "LOGIN_SUCCESS" });
            }}
            switchToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <SignupForm
            onSignup={(profileData, token) => {
              localStorage.setItem("token", token);
              localStorage.setItem("profile", JSON.stringify(profileData));
              dispatch({ type: "LOAD_PROFILE", payload: profileData });
              dispatch({ type: "LOGIN_SUCCESS" });
            }}
            switchToLogin={() => setAuthMode("login")}
          />
        )}
      </AuthLayout>
    );
  }

  if (state.step === 5) {
    return <JobDashboard user={state.profile} />;
  }

  return (
    <ProfileLayout>
      {state.step < 5 && <StepProgress />}
      <main style={{ marginTop: "2rem" }}>
        {renderStep()}
      </main>
    </ProfileLayout>
  );
}