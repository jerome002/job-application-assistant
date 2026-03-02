import axios from "axios";

// Clean the URL: Remove trailing slash if it exists to prevent double slashes like //auth/login
const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const cleanBaseURL = rawBaseURL.replace(/\/+$/, "");

const API = axios.create({
  baseURL: cleanBaseURL,
  timeout: 15000, // 15s timeout - crucial for slow Render spin-ups (Free Tier)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors and session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Professional Touch: Auto-logout if token is expired/invalid (401)
      if (error.response.status === 401) {
        console.warn("Session expired. Redirecting to login...");
        localStorage.removeItem("token");
        // Only redirect if we aren't already on the login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error("Network Error: No response received from server.");
    } else {
      console.error("Axios Configuration Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;