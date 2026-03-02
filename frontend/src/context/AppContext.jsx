import { createContext, useReducer, useEffect } from "react";

export const AppContext = createContext();

export const initialState = {
  user: null,
  token: null,
  jobs: [],
  matches: [],
  isInitializing: true, // Tracks if we are still reading from localStorage
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isInitializing: false, // Loading is done
      };
    case "AUTH_READY":
      return {
        ...state,
        isInitializing: false, // No user found, but loading is done
      };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { ...initialState, isInitializing: false };
    case "SET_JOBS":
      return { ...state, jobs: action.payload };
    case "SET_MATCHES":
      return { ...state, matches: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load token + user from localStorage on startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
        dispatch({ 
          type: "SET_USER", 
          payload: { user: JSON.parse(user), token } 
        });
      } catch (err) {
        console.error("Failed to parse user from storage", err);
        dispatch({ type: "AUTH_READY" });
      }
    } else {
      dispatch({ type: "AUTH_READY" });
    }
  }, []);

  // Sync user object to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  }, [state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};