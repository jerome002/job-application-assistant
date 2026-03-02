import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // Added for navigation
import API from "../utils/api";
import { AppContext } from "../context/AppContext";
import JobDetailModal from "../components/JobDetailModal";
import styles from "../styles/Dashboard.module.css";

export default function ApplicationsPage() {
  const { state } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [appFilter, setAppFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!state.token) return;
      try {
        const res = await API.get("/applications/my-apps");
        const appsData = res.data.applications || res.data.data?.applications || [];
        setApplications(Array.isArray(appsData) ? appsData : []);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [state.token]);

  const filteredApps = applications.filter(app => {
    if (appFilter === "all") return true;
    const isAI = app.notes?.toLowerCase().includes("ai");
    return appFilter === "ai" ? isAI : !isAI;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header Section with Dashboard Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Applications</h1>
          <p className="text-gray-500 mt-1">Track and manage your career progress.</p>
        </div>
        
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Styled Filter Buttons */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl w-fit mb-8">
        {["all", "ai", "manual"].map((f) => (
          <button
            key={f}
            onClick={() => setAppFilter(f)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              appFilter === f 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-300/50"
            }`}
          >
            {f === "ai" ? "AI Applied" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.length === 0 ? (
          <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-2xl py-20 text-center">
            <p className="text-gray-400 font-medium">No applications found in this category.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div 
              key={app._id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all hover:shadow-md cursor-pointer group"
              onClick={() => app.job && setSelectedJob(app.job)}
            >
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 truncate">
                {app.job?.title || "Position No Longer Available"}
              </h3>
              <p className="text-gray-500 font-medium mb-4">
                {app.job?.company || "N/A"}
              </p>

              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    app.status === "rejected" ? "bg-red-400" : "bg-blue-500"
                  }`} 
                  style={{ width: app.status === "applied" ? "70%" : "100%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider ${
                  app.notes?.toLowerCase().includes("ai") 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {app.notes?.toLowerCase().includes("ai") ? "AI Managed" : app.status}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for detail view */}
      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}