import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function PrivateRoute({ children }) {
  const { state } = useContext(AppContext);

  // While checking localStorage, show a loading screen 
  // to prevent an accidental redirect to login.
  if (state.isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Restoring session...</p>
        </div>
      </div>
    );
  }

  // Once initialized, if there's no token, go to login. 
  // If there is a token, allow access to the page.
  return state.token ? children : <Navigate to="/login" replace />;
}