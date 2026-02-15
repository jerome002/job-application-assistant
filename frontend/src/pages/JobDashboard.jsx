import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./JobDashboard.module.css";

const SOCKET_URL = "http://localhost:5000";

const JobDashboard = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoApply, setAutoApply] = useState(false);

  // Global reset to ensure full-width professional layout
  useEffect(() => {
    document.body.style.backgroundColor = "#f1f5f9";
    const root = document.getElementById('root');
    if (root) { 
      root.style.maxWidth = "none"; 
      root.style.width = "100%"; 
      root.style.padding = "0";
      root.style.margin = "0";
    }
  }, []);

  const fetchInitialMatches = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${SOCKET_URL}/api/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Match fetch failed", err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchInitialMatches();
    const socket = io(SOCKET_URL);
    const userId = user._id || user.id;
    if (userId) socket.emit('join_room', userId);

    socket.on('new_match', (data) => {
      if (data?.match) {
        setMatches((prev) => [data.match, ...prev]);
        setNotifications((prev) => [`✨ New match found: ${data.match.job?.title}`].concat(prev).slice(0, 8));
        toast.success(`New Match: ${data.match.job?.title}`);
      }
    });
    return () => socket.disconnect();
  }, [user, fetchInitialMatches]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    window.location.href = "/"; // Force redirect to login
  };

  if (loading) return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
      <p>Syncing your professional profile...</p>
    </div>
  );

  return (
    <div className={styles.dashboardLayout}>
      <ToastContainer position="bottom-right" theme="dark" />

      {/* LEFT SIDEBAR: PROFILE & CONTROLS */}
      <aside className={styles.sidebar}>
        <div className={styles.profileCard}>
          <div className={styles.avatarGlow}>
            <div className={styles.avatarInner}>
              {user?.personal?.first_name?.[0]}{user?.personal?.last_name?.[0]}
            </div>
          </div>
          <h3 className={styles.userName}>{user?.personal?.first_name} {user?.personal?.last_name}</h3>
          <p className={styles.userTitle}>Professional Candidate</p>
          <div className={styles.statusBadge}>Ready to Work</div>
        </div>
        
        <div className={styles.glassCard}>
          <h4 className={styles.sectionLabel}>CORE EXPERTISE</h4>
          <div className={styles.skillCloud}>
            {user?.skills?.map(s => <span key={s} className={styles.modernTag}>{s}</span>)}
          </div>
        </div>

        {/* PRO FEATURE: AUTO-APPLY TOGGLE */}
        <div className={styles.glassCard} style={{marginTop: '20px'}}>
          <div className={styles.toggleRow}>
             <div>
               <h4 className={styles.sectionLabel} style={{margin: 0}}>AUTO-APPLY</h4>
               <p style={{fontSize: '0.7rem', color: '#64748b'}}>Let AI submit for you</p>
             </div>
             <input 
              type="checkbox" 
              className={styles.toggleInput} 
              checked={autoApply}
              onChange={() => setAutoApply(!autoApply)}
             />
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span>🚪</span> Sign Out
        </button>
      </aside>

      {/* CENTER: LIVE FEED */}
      <main className={styles.mainFeed}>
        <div className={styles.feedHeader}>
          <div>
            <h1 className={styles.mainHeading}>Live Opportunities</h1>
            <p className={styles.subHeading}>AI is scanning thousands of listings for you.</p>
          </div>
          <div className={styles.pulseContainer}>
            <span className={styles.pulseDot}></span>
            Live Scan
          </div>
        </div>

        {/* QUICK FILTERS */}
        <div className={styles.filterBar}>
            <button className={`${styles.filterTab} ${styles.activeTab}`}>All Matches</button>
            <button className={styles.filterTab}>Remote Only</button>
            <button className={styles.filterTab}>High Salary</button>
        </div>
        
        <div className={styles.jobList}>
          {matches.length > 0 ? matches.map((m) => (
            <div key={m._id} className={styles.jobCard}>
              <div className={styles.jobCardContent}>
                <div className={styles.jobInfo}>
                  <h3 className={styles.jobTitle}>{m.job?.title}</h3>
                  <p className={styles.companyName}>🏢 {m.job?.company}</p>
                  <div className={styles.jobMeta}>
                    <span>📍 {m.job?.location || 'Remote'}</span>
                    <span>💰 Competitive</span>
                    <span>🕒 Just Now</span>
                  </div>
                </div>
                <div className={styles.scoreContainer}>
                  <div className={styles.scoreCircle} style={{borderColor: m.score > 80 ? '#4ade80' : '#6366f1'}}>
                    <span className={styles.scoreNum}>{m.score}%</span>
                    <span className={styles.scoreLabel}>Match</span>
                  </div>
                </div>
              </div>
              <div className={styles.jobActions}>
                <button className={styles.applyBtn} onClick={() => window.open(m.job?.url)}>
                  View & Apply
                </button>
                <button className={styles.secondaryBtn}>Save for Later</button>
              </div>
            </div>
          )) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>Analyzing Job Market...</h3>
              <p>We are matching your profile with live APIs. Results appear here instantly.</p>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT: ACTIVITY LOG */}
      <aside className={styles.rightSidebar}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Found for You</p>
          <p className={styles.statVal}>{matches.length}</p>
        </div>

        <div className={styles.logCard}>
          <h4 className={styles.sectionLabel}>AI ACTIVITY LOG</h4>
          <div className={styles.logList}>
            {notifications.map((n, i) => (
              <div key={i} className={styles.logEntry}>{n}</div>
            ))}
            {notifications.length === 0 && <p className={styles.logPlaceholder}>Monitoring live streams...</p>}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default JobDashboard;