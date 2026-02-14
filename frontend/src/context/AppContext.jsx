import React, { createContext, useContext, useReducer, useEffect } from "react";
import { profileReducer, initialState } from "../reducer/ProfileReducer";

export const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Load profile from localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const profile = localStorage.getItem("profile");

    if (token && profile) {
      dispatch({ type: "LOAD_PROFILE", payload: JSON.parse(profile) });
      // Do NOT auto-login; user must login manually
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
};
