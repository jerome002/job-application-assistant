import axios from "axios";

// Clean the URL: Remove trailing slash if it exists
const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const cleanBaseURL = rawBaseURL.replace(/\/+$/, "");

const API = axios.create({
  baseURL: cleanBaseURL,
  // CRITICAL: Increased to 60s to allow Render Free Tier to "wake up"
  timeout: 60000, 
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
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors and session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Auto-logout on 401 (Unauthorized/Expired)
      if (error.response.status === 401) {
        console.warn("Session expired. Redirecting...");
        localStorage.removeItem("token");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error("⏱Request Timeout: The server is taking too long to wake up.");
    } else if (error.request) {
      console.error("Network Error: No response received. Check if backend is awake.");
    } else {
      console.error("Config Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;