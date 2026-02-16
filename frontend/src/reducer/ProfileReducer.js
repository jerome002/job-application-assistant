export const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  step: Number(localStorage.getItem("currentStep")) || 1,
  profile: {
    personal: { first_name: "", last_name: "", email: "", location: "", phone: "" },
    skills: [],
    experience: [],
    settings: { autoApply: false }
  }
};

export function profileReducer(state, action) {
  switch (action.type) {
    case "SET_PROFILE":
      const data = action.payload || {};
      return {
        ...state,
        profile: {
          ...state.profile,
          ...data,
          personal: { 
            ...state.profile.personal, 
            ...(data.personal || {}),
            email: data.email || data.personal?.email || state.profile.personal.email 
          },
          skills: data.skills || state.profile.skills || [],
          experience: data.experience || state.profile.experience || [],
        }
      };

    case "UPDATE_PERSONAL":
      return {
        ...state,
        profile: {
          ...state.profile,
          personal: { ...state.profile.personal, ...action.payload }
        }
      };

    // --- FIXED SKILLS ---
    case "ADD_SKILL":
      // Standardized to action.payload
      if (state.profile.skills.includes(action.payload)) return state;
      return {
        ...state,
        profile: {
          ...state.profile,
          skills: [...state.profile.skills, action.payload]
        }
      };

    case "REMOVE_SKILL":
      // Standardized to action.payload (the string name of the skill)
      return {
        ...state,
        profile: {
          ...state.profile,
          skills: state.profile.skills.filter(skill => skill !== action.payload)
        }
      };

    // --- FIXED EXPERIENCE ---
    case "ADD_EXPERIENCE":
      return {
        ...state,
        profile: {
          ...state.profile,
          experience: [...state.profile.experience, action.payload]
        }
      };

    case "REMOVE_EXPERIENCE":
      // Standardized to action.payload (the index number)
      return {
        ...state,
        profile: {
          ...state.profile,
          experience: state.profile.experience.filter((_, i) => i !== action.payload)
        }
      };

    case "SET_STEP":
      localStorage.setItem("currentStep", action.payload);
      return { ...state, step: action.payload };

    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...initialState,
        isAuthenticated: false,
        step: 1
      };

    default:
      return state;
  }
}