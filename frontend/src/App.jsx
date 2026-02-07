import { useReducer, useState } from "react";
import { profileReducer, initialState } from "./reducer/ProfileReducer";
import { ProfileContext } from "./context/AppContext";

import PersonalStep from "./components/steps/PersonalStep";
import AccountStep from "./components/steps/AccountStep";
import SkillsStep from "./components/steps/SkillsStep";
import ExperienceStep from "./components/steps/ExperienceStep";
import ReviewStep from "./components/steps/ReviewStep";
import StepProgress from "./components/steps/StepProgress";

import ProfileLayout from "./Layout/ProfileLayout";
import AuthLayout from "./Layout/AuthLayout";

import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

export default function App() {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'

  /* ---------------- PROFILE STEPS ---------------- */

  let StepComponent;
  switch (state.step) {
    case 1:
      StepComponent = <PersonalStep />;
      break;
    case 2:
      StepComponent = <AccountStep />;
      break;
    case 3:
      StepComponent = <ExperienceStep />;
      break;
    case 4:
      StepComponent = <SkillsStep />;
      break;
    case 5:
      StepComponent = <ReviewStep />;
      break;
    default:
      StepComponent = <PersonalStep />;
  }

  /* ---------------- AUTH FLOW ---------------- */

  if (!isLoggedIn) {
    return (
      <AuthLayout>
        {authMode === "login" && (
          <LoginForm
            onLogin={() => setIsLoggedIn(true)}
            switchToSignup={() => setAuthMode("signup")}
          />
        )}

        {authMode === "signup" && (
          <SignupForm
            onSignup={() => setIsLoggedIn(true)}
            switchToLogin={() => setAuthMode("login")}
          />
        )}
      </AuthLayout>
    );
  }

  /* ---------------- APP FLOW ---------------- */

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      <ProfileLayout>
        <StepProgress />
        <h1>Profile Builder</h1>
        {StepComponent}
      </ProfileLayout>
    </ProfileContext.Provider>
  );
}
