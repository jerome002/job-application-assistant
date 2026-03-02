import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

export default function Header() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active links
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setDropdownOpen(false);
    navigate("/login");
  };

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-600";

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <span className="text-3xl"></span> JOB MATCH AND APPLICATION ASSISTANT
      </Link>

      {state.token ? (
        <nav className="flex items-center gap-6">
          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className={`font-medium pb-1 transition-all ${isActive("/dashboard")}`}>
              Dashboard
            </Link>
            <Link to="/jobs" className={`font-medium pb-1 transition-all ${isActive("/jobs")}`}>
              Jobs
            </Link>
            <Link to="/applications" className={`font-medium pb-1 transition-all ${isActive("/applications")}`}>
              Applications
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-100 transition-all shadow-sm"
            >
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {state.user?.first_name?.[0] || state.user?.name?.[0] || "U"}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {state.user?.first_name || state.user?.name || "Account"}
              </span>
              <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{state.user?.email}</p>
                </div>
                
                <button
                  onClick={() => { navigate("/profile/view"); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  View Profile
                </button>
                <button
                  onClick={() => { navigate("/profile/edit"); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  Edit Profile
                </button>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center gap-2"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all">
            Login
          </Link>
          <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-semibold">
            Join Now
          </Link>
        </div>
      )}
    </header>
  );
}