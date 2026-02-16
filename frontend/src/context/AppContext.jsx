import React, { createContext, useContext, useReducer } from "react";
import { profileReducer, initialState } from "../reducer/ProfileReducer";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);