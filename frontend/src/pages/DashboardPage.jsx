import React, { useEffect, useContext, useState, useCallback } from "react";
import API from "../utils/api";
import { AppContext } from "../context/AppContext";
import Header from "../components/layout/Header";
import JobDetailModal from "../components/JobDetailModal"; // Import the modal
import { connectSocket, disconnectSocket } from "../utils/socket";

export default function DashboardPage() {
  const { state, dispatch } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("matches");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // NEW: State for modal

  const fetchDashboardData = useCallback(async () => {
    if (!state.token) return;
    setLoading(true);
    try {
      const [jobsRes, matchesRes, appsRes] = await Promise.all([
        API.get("/jobs"),
        API.get("/matches"),
        API.get("/applications/my-apps"),
      ]);
      const jobs = jobsRes.data.data?.jobs || jobsRes.data.jobs || jobsRes.data;
      const matches = matchesRes.data.data?.matches || matchesRes.data.matches || matchesRes.data;
      const apps = appsRes.data.data?.applications || appsRes.data.applications || appsRes.data;

      dispatch({ type: "SET_JOBS", payload: Array.isArray(jobs) ? jobs : [] });
      dispatch({ type: "SET_MATCHES", payload: Array.isArray(matches) ? matches : [] });
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (err) {
      console.error("Dashboard Sync Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [state.token, dispatch]);

  useEffect(() => {
    fetchDashboardData();
    const userId = state.user?.id || state.user?._id;
    if (userId) {
      connectSocket(userId);
      window.socket?.on("new_match", (msg) => {
        setNotifications((prev) => [msg, ...prev]);
        setTimeout(() => setNotifications((prev) => prev.slice(0, -1)), 5000);
      });
    }
    return () => disconnectSocket();
  }, [state.token, state.user, fetchDashboardData]);

  const handleApply = async (jobId) => {
    if (!jobId) return;
    setApplyingId(jobId);
    try {
      const res = await API.post("/applications/apply", { 
        jobId,
        notes: "Manual Application from Dashboard" 
      });
      if (res.data.success) {
        alert("Application submitted successfully!");
        fetchDashboardData(); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  const filteredMatches = (state.matches || []).filter(m => 
    m.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.job?.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApps = (applications || []).filter(app => 
    app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job?.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasApplied = (jobId) => applications.some(app => app.job?._id === jobId || app.job === jobId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        {notifications.map((n, i) => (
          <div key={i} className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl animate-bounce">
            <p className="font-bold text-sm">New Match Found!</p>
            <p className="text-xs">{n.message} ({n.score}%)</p>
          </div>
        ))}
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Tabs and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl w-fit">
            {["matches", "applications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search roles or companies..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "matches" ? (
              filteredMatches.map((match) => (
                <div 
                  key={match._id} 
                  onClick={() => setSelectedJob(match.job)} // Open Modal on click
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600">{match.job?.title}</h3>
                    <span className="text-xs font-black px-2 py-1 bg-blue-100 text-blue-700 rounded-md">{match.score}%</span>
                  </div>
                  <p className="text-gray-500 font-medium mb-4">{match.job?.company}</p>
                  
                  <button 
                    disabled={applyingId === match.job?._id || hasApplied(match.job?._id)}
                    onClick={(e) => {
                        e.stopPropagation(); // STOP modal from opening when clicking button
                        handleApply(match.job?._id);
                    }}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                        hasApplied(match.job?._id) ? "bg-gray-100 text-gray-400" : "bg-gray-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    {applyingId === match.job?._id ? "..." : hasApplied(match.job?._id) ? "Applied" : "Apply Now"}
                  </button>
                </div>
              ))
            ) : (
              /* Applications List */
              filteredApps.map((app) => (
                <div key={app._id} onClick={() => setSelectedJob(app.job)} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer">
                  <h3 className="font-bold text-lg text-gray-800">{app.job?.title || "Position Unavailable"}</h3>
                  <p className="text-gray-500 mb-4">{app.job?.company}</p>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600 uppercase">
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* RENDER MODAL HERE */}
      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}