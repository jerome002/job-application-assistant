export const initialState = {
  user: null,
  token: null,
  jobs: [],
  matches: [],
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user ?? action.payload, // ensure fallback
        token: action.payload.token ?? state.token,
      };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { ...initialState };
    case "SET_JOBS":
      return { ...state, jobs: action.payload };
    case "SET_MATCHES":
      return { ...state, matches: action.payload };
    default:
      return state;
  }
};