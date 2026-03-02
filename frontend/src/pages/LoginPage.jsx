import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { AppContext } from "../context/AppContext";

export default function LoginPage() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state.token) navigate("/dashboard");
  }, [state.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, profile } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(profile));
      dispatch({ type: "SET_USER", payload: { user: profile, token } });

      navigate(profile.personal ? "/dashboard" : "/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Enter your details to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="your email address"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold mt-4 hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          New here? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}