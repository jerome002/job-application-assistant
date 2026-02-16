import React, { useState } from 'react';
import { useProfile } from '../../context/AppContext';
import styles from './SkillsStep.module.css';

export default function SkillsStep() {
  const { state, dispatch } = useProfile();
  const [skillInput, setSkillInput] = useState("");
  
  // Safely access skills from the nested profile
  const skills = state.profile?.skills || [];

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      // Use the action type your reducer actually has!
      dispatch({ type: 'ADD_SKILL', payload: trimmed });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    // Standardized to the payload your reducer now expects
    dispatch({ type: 'REMOVE_SKILL', payload: skillToRemove });
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Technical Skills</h2>
          <p className={styles.subtitle}>Add the tools and technologies you excel at.</p>
        </div>

        <div className={styles.inputRow}>
          <input 
            className={styles.input}
            placeholder="e.g. React, Python, Figma"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          />
          <button className={styles.addButton} type="button" onClick={addSkill}>Add</button>
        </div>

        <div className={styles.tagContainer}>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span key={index} className={styles.tag}>
                {skill}
                <button 
                  className={styles.removeTag} 
                  type="button" 
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <p className={styles.emptyText}>No skills added yet...</p>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>
            Back
          </button>
          <button 
            className={styles.nextBtn} 
            disabled={skills.length === 0}
            onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
          >
            Continue to Experience
          </button>
        </div>
      </div>
    </div>
  );
}