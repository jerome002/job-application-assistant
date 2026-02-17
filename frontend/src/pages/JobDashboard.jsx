import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import { useProfile } from "../context/AppContext";
import 'react-toastify/dist/ReactToastify.css';
import styles from "./JobDashboard.module.css";

const SOCKET_URL = "http://localhost:5000";

const JobDashboard = ({ onEdit, onViewApps }) => {
  const { state, dispatch } = useProfile();
  
  // Feed & Data State
  const [matches, setMatches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("explore");
  const [loading, setLoading] = useState(true);

  // Modal & Settings State
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [autoApply, setAutoApply] = useState(state.profile?.settings?.autoApply || false);

  // Persistent Logs
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('dash_logs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // User Data Extraction
  const user = state.profile || {};
  const personal = user.personal || {};
  const firstName = personal.first_name || "User";
  const lastName = personal.last_name || "";
  const displayEmail = user.email || personal.email || "No email provided";
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const experience = Array.isArray(user.experience) ? user.experience : [];

  const addLog = useCallback((message) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const newLog = `[${time}] ${message}`;
    setActivityLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 25);
      localStorage.setItem('dash_logs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fetchData = useCallback(async (isManual = false) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [jobsRes, matchesRes, appsRes] = await Promise.all([
        fetch(`${SOCKET_URL}/api/jobs`, { headers }),
        fetch(`${SOCKET_URL}/api/matches`, { headers }),
        fetch(`${SOCKET_URL}/api/applications/my-apps`, { headers })
      ]);

      const jobs = await jobsRes.json();
      const matchesData = await matchesRes.json();
      const apps = await appsRes.json();

      setAllJobs(Array.isArray(jobs) ? jobs : []);
      setMatches(Array.isArray(matchesData) ? matchesData : []);
      setApplications(Array.isArray(apps) ? apps : []);
      
      addLog(isManual ? "🔄 Manual Sync: Completed" : "Dashboard Loaded");
    } catch (err) {
      addLog("Connection Error: Data Sync Failed");
    } finally {
      setLoading(false);
    }
  }, [addLog]);

  const toggleAutoApply = async () => {
    const token = localStorage.getItem('token');
    const newValue = !autoApply;
    try {
      const res = await fetch(`${SOCKET_URL}/api/profile/settings`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoApply: newValue })
      });
      if (res.ok) {
        setAutoApply(newValue);
        addLog(`Auto-Apply: ${newValue ? "ENABLED" : "DISABLED"}`);
        toast.info(`Auto-Apply ${newValue ? "Enabled" : "Disabled"}`);
      }
    } catch (err) {
      addLog("Settings Failed");
    }
  };

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${SOCKET_URL}/api/applications/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        toast.success("Applied!");
        addLog(`Applied: ${selectedJob?.title || "Job Opportunity"}`);
        fetchData(); 
        setSelectedJob(null); 
      }
    } catch (err) {
      addLog("Application Failed");
    }
  };

  useEffect(() => {
    addLog("AI Engine Online");
    fetchData();

    const socket = io(SOCKET_URL);
    if (user._id) socket.emit('join_room', user._id);
    
    socket.on('new_match', (data) => {
      setMatches(prev => [data.match, ...prev]);
      addLog(`✨ Match Found: ${data.match.job?.title}`);
      toast.success("New AI Match Found!");
    });

    return () => socket.disconnect();
  }, [user._id, fetchData, addLog]);

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
            <button className={styles.viewBtn} onClick={() => setShowFullProfile(true)}>View Profile</button>
            <button className={styles.trackerBtn} onClick={onViewApps}>Detailed Tracker</button>
            <button className={styles.editBtn} onClick={onEdit}>Edit Profile</button>
          </div>

          <div className={styles.aiToggleCard}>
             <span style={{color: 'white', fontSize: '0.8rem'}}>Auto-Apply</span>
             <button className={autoApply ? styles.toggleOn : styles.toggleOff} onClick={toggleAutoApply}>
                {autoApply ? "ON" : "OFF"}
             </button>
          </div>

          <button className={styles.logoutBtn} onClick={() => {
            if(window.confirm("Logout?")) {
                localStorage.removeItem("token");
                dispatch({ type: "LOGOUT" });
            }
          }}>Logout</button>
        </div>

        <div className={styles.glassCard}>
          <div className={styles.feedHeader} style={{marginBottom: '10px'}}>
            <h4 className={styles.sectionLabel} style={{margin: 0, fontSize: '0.7rem', color: '#64748b'}}>SYSTEM LOGS</h4>
            <button className={styles.clearBtn} style={{background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.7rem'}} 
                    onClick={() => { setActivityLogs([]); localStorage.removeItem('dash_logs'); }}>Clear</button>
          </div>
          <div className={styles.logContainer}>
            {activityLogs.length > 0 ? (
              activityLogs.map((log, i) => <p key={i} className={styles.logItem}>{log}</p>)
            ) : <p className={styles.logPlaceholder}>Monitoring system...</p>}
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
          <button className={styles.refreshBtn} onClick={() => fetchData(true)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>🔄</button>
        </div>
        
        <div className={styles.jobList}>
          {activeTab === "explore" && allJobs.map((job) => (
            <div key={job._id} className={styles.jobCard}>
              <h3>{job.title}</h3>
              <p className={styles.companyName}>{job.company}</p>
              <div className={styles.jobDetails}>
                <span>{job.location || 'Remote'}</span>
                <span>{job.salary || 'Competitive'}</span>
              </div>
              <button className={styles.applyBtn} onClick={() => setSelectedJob(job)}>View & Apply</button>
            </div>
          ))}

          {activeTab === "matches" && matches.map((m) => (
            <div key={m._id} className={styles.jobCard}>
              <div className={styles.matchScoreBadge}>{m.score}% AI Match</div>
              <h3>{m.job?.title}</h3>
              <p className={styles.companyName}>{m.job?.company}</p>
              <button className={styles.applyBtn} onClick={() => setSelectedJob(m.job)}>View & Apply</button>
            </div>
          ))}

          {activeTab === "applied" && applications.map((app) => (
            <div key={app._id} className={`${styles.jobCard} ${styles.appliedCard}`}>
              <div className={styles.statusBadge}>{app.status || "Pending"}</div>
              <h3>{app.jobTitle || app.job?.title}</h3>
              <p className={styles.companyName}>{app.companyName || app.job?.company}</p>
              <p className={styles.appliedDate}>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
              {app.notes?.includes("AI") && <div className={styles.aiAppliedTag}>AI Auto-Applied</div>}
            </div>
          ))}
          
          {(activeTab === "explore" ? allJobs : activeTab === "matches" ? matches : applications).length === 0 && (
            <p className={styles.emptyMsg}>No data found in this category.</p>
          )}
        </div>
      </main>

      {/* --- MODAL: JOB DETAILS --- */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} style={{padding: '40px'}} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} style={{color: '#1e293b'}} onClick={() => setSelectedJob(null)}>×</button>
            <h2 style={{margin: '0 0 10px'}}>{selectedJob.title}</h2>
            <h4 style={{color: '#6366f1', margin: '0 0 20px'}}>{selectedJob.company}</h4>
            <div style={{maxHeight: '400px', overflowY: 'auto', marginBottom: '25px', color: '#475569', lineHeight: '1.6'}}>
                <p>{selectedJob.description || "No detailed description available."}</p>
            </div>
            <button className={styles.applyBtn} onClick={() => handleApply(selectedJob._id)}>Confirm Application</button>
          </div>
        </div>
      )}

      {/* --- MODAL: FULL PROFILE --- */}
      {showFullProfile && (
        <div className={styles.modalOverlay} onClick={() => setShowFullProfile(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
                <div className={styles.avatarGlow} style={{margin: 0}}>
                    <div className={styles.avatarInner}>{firstName[0]}{lastName[0]}</div>
                </div>
                <div>
                    <h2 style={{margin: 0}}>{firstName} {lastName}</h2>
                    <p style={{margin: 0, opacity: 0.8, fontSize: '0.9rem'}}>{personal.title || "Career Professional"}</p>
                </div>
                <button className={styles.closeModal} onClick={() => setShowFullProfile(false)}>×</button>
            </div>

            <div className={styles.modalBody}>
                <section className={styles.modalSection}>
                    <h3>Personal Information</h3>
                    <div className={styles.personalGrid}>
                        <div className={styles.infoBox}><label>Email</label><p>{displayEmail}</p></div>
                        <div className={styles.infoBox}><label>Phone</label><p>{personal.phone || 'N/A'}</p></div>
                        <div className={styles.infoBox}><label>Location</label><p>{personal.location || 'N/A'}</p></div>
                        <div className={styles.infoBox}><label>Portfolio</label><p>{personal.website ? 'Available' : 'N/A'}</p></div>
                    </div>
                </section>

                <section className={styles.modalSection}>
                    <h3>Skills & Expertise</h3>
                    <div className={styles.skillCloud}>
                        {skills.length > 0 ? skills.map((s, i) => (
                            <span key={i} className={styles.modernTag}>{s}</span>
                        )) : <p className={styles.emptyMsg}>No skills added.</p>}
                    </div>
                </section>

                <section className={styles.modalSection}>
                    <h3>Work Experience</h3>
                    {experience.length > 0 ? experience.map((exp, i) => (
                        <div key={i} className={styles.experienceItem}>
                            <h4>{exp.title || exp.role}</h4>
                            <p style={{margin: '2px 0', fontWeight: 600, color: '#4b5563'}}>{exp.company}</p>
                            <div className={styles.expYears}>{exp.startDate} — {exp.endDate || 'Present'}</div>
                            {exp.description && <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '8px'}}>{exp.description}</p>}
                        </div>
                    )) : <p className={styles.emptyMsg}>No experience history added.</p>}
                </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDashboard;