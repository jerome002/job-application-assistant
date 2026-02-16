import React, { useState } from 'react';
import { useProfile } from '../../context/AppContext';
import styles from './ExperienceStep.module.css';

export default function ExperienceStep() {
  const { state, dispatch } = useProfile();
  const [form, setForm] = useState({ role: "", company: "", years: "" });
  const experiences = state.profile.experience || [];

  const addExperience = () => {
    if (form.role && form.company && form.years) {
      dispatch({ type: 'ADD_EXPERIENCE', payload: form });
      setForm({ role: "", company: "", years: "" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Work Experience</h2>
          <p className={styles.subtitle}>List your previous roles and milestones.</p>
        </div>

        <div className={styles.expForm}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Job Title / Role</label>
            <input 
              className={styles.input}
              placeholder="e.g. Senior Software Engineer"
              value={form.role}
              onChange={(e) => setForm({...form, role: e.target.value})}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Company</label>
            <input 
              className={styles.input}
              placeholder="e.g. Google"
              value={form.company}
              onChange={(e) => setForm({...form, company: e.target.value})}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Years / Duration</label>
            <input 
              className={styles.input}
              placeholder="e.g. 2020 - 2023"
              value={form.years}
              onChange={(e) => setForm({...form, years: e.target.value})}
            />
          </div>
          <button className={styles.addBtn} onClick={addExperience}>+ Add Experience</button>
        </div>

        <div className={styles.experienceList}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.experienceItem}>
              <div className={styles.expInfo}>
                <h4>{exp.role}</h4>
                <p>{exp.company} • {exp.years}</p>
              </div>
              <button 
                className={styles.removeBtn}
                onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', payload: index })}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>
            Back
          </button>
          <button className={styles.nextBtn} onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}>
            Review Profile
          </button>
        </div>
      </div>
    </div>
  );
}