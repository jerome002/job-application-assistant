const savedToken = localStorage.getItem("token");
const savedProfile = localStorage.getItem("profile");

export const initialState = {
  // If we have a token, assume they are authenticated for now
  isAuthenticated: !!savedToken, 
  step: Number(localStorage.getItem("currentStep")) || 1,
  profile: savedProfile ? JSON.parse(savedProfile) : {
    personal: { first_name: "", middle_name: "", last_name: "", age: "" },
    account: { email: "", password: "" },
    skills: [],
    experience: []
  }
};
export function profileReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.section]: {
            // Guard against undefined sections to prevent crashes
            ...(state.profile[action.section] || {}),
            [action.field]: action.value
          }
        }
      };

    case "ADD_SKILL":
      if (!action.value || state.profile.skills.includes(action.value)) return state;
      return {
        ...state,
        profile: { ...state.profile, skills: [...state.profile.skills, action.value] }
      };

    case "REMOVE_SKILL":
      return {
        ...state,
        profile: {
          ...state.profile,
          skills: state.profile.skills.filter((_, i) => i !== action.index)
        }
      };

    case "ADD_EXPERIENCE":
      return {
        ...state,
        profile: { ...state.profile, experience: [...state.profile.experience, action.value] }
      };

    case "REMOVE_EXPERIENCE":
      return {
        ...state,
        profile: {
          ...state.profile,
          experience: state.profile.experience.filter((_, i) => i !== action.index)
        }
      };

    case "UPDATE_EXPERIENCE_FIELD":
      const updated = [...state.profile.experience];
      updated[action.index] = action.value;
      return { ...state, profile: { ...state.profile, experience: updated } };

    case "LOAD_PROFILE":
    case "SET_PROFILE":
      const payload = action.payload || {};
      return {
        ...state,
        profile: {
          // Merge payload into CURRENT state, not initialState, 
          // to prevent wiping data when moving between steps.
          ...state.profile,
          personal: { ...state.profile.personal, ...(payload.personal || {}) },
          account: { ...state.profile.account, ...(payload.account || {}) },
          skills: Array.isArray(payload.skills) ? payload.skills : state.profile.skills,
          experience: Array.isArray(payload.experience) ? payload.experience : state.profile.experience
        }
      };

    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };

    case "LOGOUT":
      localStorage.clear(); // Clears token, profile, and currentStep
      return initialState;

    case "NEXT_STEP":
      // Increased to 5 to allow for Review step visibility
      return { ...state, step: Math.min(state.step + 1, 5) };

    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };

    case "GO_TO_STEP":
      return { ...state, step: action.step };

    default:
      return state;
  }
}