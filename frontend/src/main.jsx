import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Pages
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage"; // IMPORT THIS
import ProfileFormPage from "./pages/ProfileFormPage";
import ProfileViewPage from "./pages/ProfileViewPage";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AppProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        
        {/* ADD THIS ROUTE - This was likely why you were redirected to Home */}
        <Route path="/applications" element={<PrivateRoute><ApplicationsPage /></PrivateRoute>} />

        <Route path="/profile/edit" element={<PrivateRoute><ProfileFormPage /></PrivateRoute>} />
        <Route path="/profile/view" element={<PrivateRoute><ProfileViewPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </AppProvider>
);