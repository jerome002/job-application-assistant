import { useReducer, useState, useEffect } from "react";
import { profileReducer, initialState } from "./reducer/ProfileReducer";
import { ProfileContext } from "./context/AppContext";

import ProfileLayout from "./Layout/ProfileLayout";
import AuthLayout from "./Layout/AuthLayout";

import PersonalStep from "./components/steps/PersonalStep";
import AccountStep from "./components/steps/AccountStep";
import SkillsStep from "./components/steps/SkillsStep";
import ExperienceStep from "./components/steps/ExperienceStep";
import ReviewStep from "./components/steps/ReviewStep";
import StepProgress from "./components/steps/StepProgress";

import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

export default function App() {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'

  /* ---------------- Load profile from localStorage if available ---------------- */
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    const token = localStorage.getItem("token"); // if you implement JWT

    if (savedProfile && token && !isLoggedIn) {
      dispatch({ type: "LOAD_PROFILE", payload: JSON.parse(savedProfile) });
      setIsLoggedIn(true);
    }
  }, [isLoggedIn, dispatch]);

  /* ---------------- Choose which step component to show ---------------- */
  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <PersonalStep />;
      case 2:
        return <AccountStep />;
      case 3:
        return <ExperienceStep />;
      case 4:
        return <SkillsStep />;
      case 5:
        return <ReviewStep />;
      default:
        return <PersonalStep />;
    }
  };

  /* ---------------- Show Auth forms if not logged in ---------------- */
  if (!isLoggedIn) {
    return (
      <AuthLayout>
        {authMode === "login" ? (
          <LoginForm
            onLogin={(profileData) => {
              // Save profile to reducer or localStorage if you want
              if (profileData) {
                dispatch({ type: "LOAD_PROFILE", payload: profileData });
                localStorage.setItem("profile", JSON.stringify(profileData));
              }
              setIsLoggedIn(true);
            }}
            switchToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <SignupForm
            onSignup={(profileData) => {
              if (profileData) {
                dispatch({ type: "LOAD_PROFILE", payload: profileData });
                localStorage.setItem("profile", JSON.stringify(profileData));
              }
              setIsLoggedIn(true);
            }}
            switchToLogin={() => setAuthMode("login")}
          />
        )}
      </AuthLayout>
    );
  }

  /* ---------------- Show Profile Builder if logged in ---------------- */
  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      <ProfileLayout>
        <StepProgress />
        <h1>Profile Builder</h1>
        {renderStep()}
      </ProfileLayout>
    </ProfileContext.Provider>
  );
}
