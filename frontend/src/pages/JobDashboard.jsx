import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import { useProfile } from "../context/AppContext";
import 'react-toastify/dist/ReactToastify.css';
import styles from "./JobDashboard.module.css";

const SOCKET_URL = "http://localhost:5000";

const JobDashboard = ({ onEdit }) => {
  const { state, dispatch } = useProfile();
  const [matches, setMatches] = useState([]);
  const [applications, setApplications] = useState([]); 
  const [allJobs, setAllJobs] = useState([]); 
  const [activeTab, setActiveTab] = useState("explore"); 
  const [activityLogs, setActivityLogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const user = state.profile || {};
  const personal = user.personal || {};
  const displayEmail = user.email || personal.email || "No email available";
  const firstName = personal.first_name || "User";
  const lastName = personal.last_name || "";
  const skills = Array.isArray(user.skills) ? user.skills : [];

  const addLog = useCallback((message) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [`[${time}] ${message}`, ...prev].slice(0, 20));
  }, []);

  // --- FETCH ALL JOBS (EXPLORE) ---
  const fetchAllJobs = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SOCKET_URL}/api/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setAllJobs(Array.isArray(data) ? data : []);
      addLog(`🌐 Explore: Found ${data.length} jobs`);
    } catch (err) {
      addLog(`❌ Failed to load overall: ${err.message}`);
      // Fallback: If your endpoint is /api/job (singular), try adjusting the URL
    }
  }, [addLog]);

  // --- FETCH MATCHES ---
  const fetchMatches = useCallback(async (isManual = false) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SOCKET_URL}/api/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const matchesData = Array.isArray(data) ? data : [];
      setMatches(matchesData);
      
      if (isManual) {
        addLog(`🔄 Sync: Found ${matchesData.length} matches`);
      } else {
        addLog(`✅ Synced ${matchesData.length} matches`);
      }
    } catch (err) {
      addLog("❌ Match sync failed");
    } finally {
      setLoading(false);
    }
  }, [addLog]);

  // --- FETCH APPLICATIONS ---
  const fetchApplications = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SOCKET_URL}/api/applications/my-apps`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch applications");
    }
  }, []);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${SOCKET_URL}/api/applications/apply`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId })
      });

      if (res.ok) {
        toast.success("Application sent! 🚀");
        const jobTitle = selectedJob.job?.title || selectedJob.title;
        addLog(`📤 Applied: ${jobTitle}`);
        fetchApplications(); 
        setSelectedJob(null); 
      }
    } catch (err) {
      toast.error("Application failed");
    }
  };

  useEffect(() => {
    addLog("🚀 Dashboard Loaded");
    fetchAllJobs();
    fetchMatches();
    fetchApplications();
    
    const socket = io(SOCKET_URL);
    const userId = state.userId || user._id;
    if (userId) socket.emit('join_room', userId);
    
    socket.on('new_match', (data) => {
      setMatches(prev => [data.match, ...prev]);
      addLog(`✨ Real-time Match: ${data.match.job?.title}`);
      toast.success("New Job Match Found!");
    });

    return () => socket.disconnect();
  }, [user._id, state.userId, fetchMatches, fetchApplications, fetchAllJobs, addLog]);

  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("token");
    }
  };

  if (loading) return <div className={styles.loaderWrapper}><div className={styles.spinner}></div></div>;

  return (
    <div className={styles.dashboardLayout}>
      <ToastContainer position="bottom-right" theme="dark" />

      {/* --- SIDEBAR --- */}
      <aside className={styles.sidebar}>
        <div className={styles.profileCard}>
          <div className={styles.avatarGlow}>
            <div className={styles.avatarInner}>{firstName[0]}{lastName[0]}</div>
          </div>
          <h3 className={styles.userName}>{firstName} {lastName}</h3>
          <p className={styles.userEmail}>{displayEmail}</p>
          <div className={styles.profileActions}>
            <button className={styles.viewBtn} onClick={() => setShowFullProfile(true)}>Profile</button>
            <button className={styles.editBtn} onClick={onEdit}>Edit</button>
            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className={styles.glassCard}>
          <h4 className={styles.sectionLabel}>ACTIVITY LOG</h4>
          <div className={styles.logContainer}>
            {activityLogs.length > 0 ? activityLogs.map((log, i) => (
              <p key={i} className={styles.logItem}>{log}</p>
            )) : <p className={styles.logItem}>Waiting for activity...</p>}
          </div>
        </div>
      </aside>

      {/* --- MAIN FEED --- */}
      <main className={styles.mainFeed}>
        <div className={styles.feedHeader}>
          <div className={styles.tabGroup}>
            <button className={activeTab === "explore" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("explore")}>Explore ({allJobs.length})</button>
            <button className={activeTab === "matches" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("matches")}>Matches ({matches.length})</button>
            <button className={activeTab === "applied" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("applied")}>Applied ({applications.length})</button>
          </div>
          <button className={styles.refreshBtn} onClick={() => { fetchAllJobs(); fetchMatches(true); }}>🔄 Refresh</button>
        </div>
        
        <div className={styles.jobList}>
          {activeTab === "explore" && allJobs.map((job, i) => (
            <div key={i} className={styles.jobCard}>
              <h3>{job.title}</h3>
              <p className={styles.companyName}>{job.company}</p>
              <div className={styles.jobDetails}>
                <span>📍 {job.location || "Remote"}</span>
                <span>💰 {job.salary || "N/A"}</span>
              </div>
              <button className={styles.applyBtn} onClick={() => setSelectedJob(job)}>View & Apply</button>
            </div>
          ))}

          {activeTab === "matches" && matches.map((m, i) => (
            <div key={i} className={styles.jobCard}>
              <div className={styles.matchScoreBadge}>{m.score}% Match</div>
              <h3>{m.job?.title}</h3>
              <p className={styles.companyName}>{m.job?.company}</p>
              <button className={styles.applyBtn} onClick={() => setSelectedJob(m)}>View & Apply</button>
            </div>
          ))}

          {activeTab === "applied" && applications.map((app, i) => (
            <div key={i} className={`${styles.jobCard} ${styles.appliedCard}`}>
              <div className={styles.statusBadge}>{app.status || "Pending"}</div>
              <h3>{app.jobTitle}</h3>
              <p className={styles.companyName}>{app.companyName}</p>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2>{selectedJob.job?.title || selectedJob.title}</h2>
              <button className={styles.closeModal} onClick={() => setSelectedJob(null)}>✕</button>
            </header>
            <div className={styles.modalBody}>
              <p>{selectedJob.job?.description || selectedJob.description || "No description available."}</p>
            </div>
            <footer className={styles.modalFooter}>
              <button className={styles.applyBtn} onClick={() => handleApply(selectedJob.job?._id || selectedJob._id)}>Confirm Application</button>
            </footer>
          </div>
        </div>
      )}

      {/* PROFILE VIEW */}
      {showFullProfile && (
        <div className={styles.modalOverlay} onClick={() => setShowFullProfile(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2>Your Profile</h2>
              <button className={styles.closeModal} onClick={() => setShowFullProfile(false)}>✕</button>
            </header>
            <div className={styles.modalBody}>
              <p><strong>Name:</strong> {firstName} {lastName}</p>
              <p><strong>Skills:</strong> {skills.join(", ") || "No skills added"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDashboard;