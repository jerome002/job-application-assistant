import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { AppContext } from "../context/AppContext";

export default function SignupPage() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state.token) navigate("/dashboard");
  }, [state.token, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        personal: { first_name: formData.firstName, last_name: formData.lastName },
      });
      const { token, profile } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(profile));
      dispatch({ type: "SET_USER", payload: { user: profile, token } });

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900">Get Started</h1>
            <p className="text-gray-500 mt-2">Join 500+ developers landing roles with AI.</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                <input name="firstName" onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-gray-50 border rounded-xl" placeholder="first name" required />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                <input name="lastName" onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-gray-50 border rounded-xl" placeholder="last name" required />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input name="email" type="email" onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-gray-50 border rounded-xl" placeholder="your email address" required />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input name="password" type="password" onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Min. 8 characters" required />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Free Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>

      {/* Right side: Visual/Benefit (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">Stop guessing. <br/>Start matching.</h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Our AI engine parses job descriptions in real-time to tell you exactly 
            which skills you need to highlight to get the interview.
          </p>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20">
            <p className="italic text-blue-50">"This tool cut my application time in half and doubled my interview callbacks."</p>
          </div>
        </div>
      </div>
    </div>
  );
}