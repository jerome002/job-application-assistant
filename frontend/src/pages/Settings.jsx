import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css'; // Import the CSS Module

const Settings = () => {
  const [autoApply, setAutoApply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setAutoApply(data.profile?.settings?.autoApply || false);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch('http://localhost:5000/api/profile/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ autoApply: !autoApply })
      });
      
      if (res.ok) {
        setAutoApply(!autoApply);
        setMessage("Automation settings updated.");
      }
    } catch (err) {
      setMessage("Update failed. Check connection.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Account Settings</h1>
      
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>AI Matching & Auto-Apply</h3>
          <button 
            onClick={handleToggle}
            disabled={loading}
            className={`${styles.toggleBtn} ${autoApply ? styles.btnOn : styles.btnOff}`}
          >
            {loading ? "..." : autoApply ? "Active" : "Disabled"}
          </button>
        </div>
        
        <p className={styles.description}>
          When <strong>Auto-Apply</strong> is active, our system will automatically 
          submit your profile to jobs where your skill match score exceeds 80%. 
          You will receive a notification via the dashboard for every submission.
        </p>

        {message && <div className={styles.statusMessage}>{message}</div>}
      </div>
    </div>
  );
};

export default Settings;