import React, { useEffect, useContext, useState, useCallback } from "react";
import API from "../utils/api";
import { AppContext } from "../context/AppContext";
import Header from "../components/layout/Header";
import JobDetailModal from "../components/JobDetailModal";
import { socket, connectSocket, disconnectSocket } from "../utils/socket";

export default function DashboardPage() {
  const { state, dispatch } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("matches");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

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

      // Use the imported socket instance for better reliability
      socket.on("new_match", (msg) => {
        setNotifications((prev) => [msg, ...prev]);
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter(n => n !== msg));
        }, 5000);
      });
    }

    return () => {
      socket.off("new_match");
      disconnectSocket();
    };
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
        fetchDashboardData(); 
      }
    } catch (err) {
      console.error("Apply Error:", err.response?.data?.message);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      {/* Real-time Toasts */}
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-3 max-w-sm w-full">
        {notifications.map((n, i) => (
          <div key={i} className="bg-gray-900 border-l-4 border-blue-500 text-white p-4 rounded-xl shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400">Match Alert</span>
              <span className="text-xs font-bold bg-blue-500/20 px-2 py-0.5 rounded">{n.score}%</span>
            </div>
            <p className="text-sm font-medium">{n.message}</p>
          </div>
        ))}
      </div>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage your AI-curated career opportunities.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex p-1 bg-gray-200/50 rounded-2xl w-full sm:w-auto">
              {["matches", "applications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Filter by role or company..."
              className="px-5 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-72 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Data...</p>
          </div>
        ) : (
          <>
            {/* Conditional Empty States */}
            {(activeTab === "matches" ? filteredMatches : filteredApps).length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                <div className="text-5xl mb-4 text-gray-300">🔍</div>
                <h3 className="text-xl font-bold text-gray-900">No {activeTab} found</h3>
                <p className="text-gray-500">Try adjusting your search or check back later for new matches.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeTab === "matches" ? (
                  filteredMatches.map((match) => (
                    <div 
                      key={match._id} 
                      onClick={() => setSelectedJob(match.job)}
                      className="group bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors">
                          <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-xs font-black px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">{match.score}% Match</span>
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-1 leading-tight">{match.job?.title}</h3>
                      <p className="text-gray-500 font-medium mb-6">{match.job?.company}</p>
                      
                      <button 
                        disabled={applyingId === match.job?._id || hasApplied(match.job?._id)}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleApply(match.job?._id);
                        }}
                        className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                            hasApplied(match.job?._id) 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-gray-900 text-white hover:bg-blue-600 shadow-lg shadow-gray-200 hover:shadow-blue-200"
                        }`}
                      >
                        {applyingId === match.job?._id ? "Processing..." : hasApplied(match.job?._id) ? "Applied" : "Quick Apply"}
                      </button>
                    </div>
                  ))
                ) : (
                  filteredApps.map((app) => (
                    <div key={app._id} onClick={() => setSelectedJob(app.job)} className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Application Status</span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-600 uppercase border border-blue-200">
                          {app.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{app.job?.title || "Position Unavailable"}</h3>
                      <p className="text-gray-500 font-medium mb-4">{app.job?.company}</p>
                      <div className="pt-4 border-t border-gray-50 text-[11px] text-gray-400 font-bold uppercase">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}