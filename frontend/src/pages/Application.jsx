import React, { useEffect, useState } from 'react';
import styles from './applications.module.css';

const Applications = ({ onBack }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/applications', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setApps(data);
      } catch (err) {
        console.error("Error fetching apps:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <div className={styles.loader}>Loading your applications...</div>;
  

  return (
    <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
      <div className={styles.header}>
        <h1>Application Tracker</h1>
        <p>You have {apps.length} total applications</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Job Role</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app._id}>
                <td className={styles.jobTitle}>{app.job?.title || 'N/A'}</td>
                <td>{app.job?.company || 'N/A'}</td>
                <td>
                  <span className={`${styles.badge} ${styles[app.status?.toLowerCase()]}`}>
                    {app.status}
                  </span>
                </td>
                <td>{new Date(app.appliedDate || app.createdAt).toLocaleDateString()}</td>
                <td>
                  {app.notes?.includes("AI") ? (
                    <span className={styles.aiLabel}>🤖 AI Auto-Apply</span>
                  ) : (
                    <span className={styles.manualLabel}>👤 Manual</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;