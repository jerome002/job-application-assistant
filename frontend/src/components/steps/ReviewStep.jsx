import React, { useState } from 'react';
import { useProfile } from '../../context/AppContext';
import api from '../../utils/api';
import styles from './ReviewStep.module.css';

export default function ReviewStep() {
  const { state, dispatch } = useProfile();
  const [loading, setLoading] = useState(false);
  const { personal, skills, experience } = state.profile;

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.put("/profile", { personal, skills, experience });
      dispatch({ type: "SET_PROFILE", payload: res.data.profile });
      dispatch({ type: "SET_STEP", payload: 5 }); 
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* THIS CARD CLASS IS THE KEY TO MATCHING STEP 1 & 2 */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Review Profile</h2>
          <p className={styles.subtitle}>Confirm your details before finalizing your professional profile.</p>
        </div>

        {/* PERSONAL SECTION - Reusing the 'Sunk-in' pattern */}
        <div className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <h3>Identity</h3>
            <button className={styles.editBtn} onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>Edit</button>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{personal.first_name} {personal.last_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{personal.email}</span>
          </div>
        </div>

        {/* SKILLS SECTION */}
        <div className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <h3>Expertise</h3>
            <button className={styles.editBtn} onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Edit</button>
          </div>
          <div className={styles.tagCloud}>
            {skills.map((s, i) => <span key={i} className={styles.tag}>{s}</span>)}
          </div>
        </div>

        {/* EXPERIENCE SECTION */}
        <div className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <h3>Experience</h3>
            <button className={styles.editBtn} onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}>Edit</button>
          </div>
          {experience.map((exp, i) => (
            <div key={i} className={styles.expItem}>
              <span className={styles.expRole}>{exp.role}</span>
              <span className={styles.expMeta}>{exp.company} • {exp.years}</span>
            </div>
          ))}
        </div>

        <button 
          className={styles.submitBtn} 
          onClick={handleFinalSubmit}
          disabled={loading}
        >
          {loading ? "Completing Profile..." : "Confirm & Finish 🚀"}
        </button>
      </div>
    </div>
  );
}