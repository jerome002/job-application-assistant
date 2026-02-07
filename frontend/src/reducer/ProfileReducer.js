// Shape of the form
// Single source of truth
export const initialState = {
  step: 1,

  profile: {
    personal: {
      first_name: "",
      middle_name: "",
      last_name: "",
      id_number: "",
      age: ""
    },
    account: {
      email: "",
      password: ""
    },
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
            ...state.profile[action.section],
            [action.field]: action.value
          }
        }
      };

    case "ADD_SKILL":
      return {
        ...state,
        profile: {
          ...state.profile,
          skills: [...state.profile.skills, action.value]
        }
      };

    case "REMOVE_SKILL":
      return {
        ...state,
        profile: {
          ...state.profile,
          skills: state.profile.skills.filter(
            (_, index) => index !== action.index
          )
        }
      };
case "ADD_EXPERIENCE":
  return {
    ...state,
    profile: {
      ...state.profile,
      experience: [...state.profile.experience, action.value]
    }
  };

case "REMOVE_EXPERIENCE":
  return {
    ...state,
    profile: {
      ...state.profile,
      experience: state.profile.experience.filter(
        (_, index) => index !== action.index
      )
    }
  };

case "UPDATE_EXPERIENCE_FIELD":
  return {
    ...state,
    profile: {
      ...state.profile,
      experience: state.profile.experience.map((item, i) =>
        i === action.index
          ? { ...item, [action.field]: action.value }
          : item
      )
    }
  };


    case "NEXT_STEP":
      return {
        ...state,
        step: state.step + 1
      };

    case "PREV_STEP":
      return {
        ...state,
        step: state.step - 1
      };
    case "GO_TO_STEP":
      return {
    ...state,
    step: action.step
  };


    case "RESET":
      return initialState;

    default:
      return state;
  }
}
