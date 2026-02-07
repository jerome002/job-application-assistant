import { useReducer } from "react";
import { profileReducer, initialState } from "./reducer/ProfileReducer";
import { ProfileContext } from "./context/AppContext";
import PersonalStep from "./components/steps/PersonalStep";
import AccountStep from "./components/steps/AccountStep";
import ReviewStep from "./components/steps/ReviewStep";
import SkillsStep from "./components/steps/SkillsStep";
import ExperienceStep from "./components/steps/ExperienceStep";

export default function App() {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  return (
    <ProfileContext.Provider value={{state, dispatch}}>
    <div>
      <h1>Profile Builder</h1>

      {state.step === 1 && (<PersonalStep state={state}/>)}

      {state.step === 2 && (<AccountStep state={state}/>)}
      {state.step === 3 && (<ExperienceStep/>)}
      {state.step === 4 && (<SkillsStep/>)}

      {state.step === 5 && (<ReviewStep />)}
    </div>
    </ProfileContext.Provider>
  );
}
