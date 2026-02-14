import React, { useState } from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./ReviewStep.module.css";
import api from "../../utils/api";

export default function ReviewStep() {
  const { state, dispatch } = useProfile();
  const { personal, account, skills, experience } = state.profile;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPersonalValid = personal.first_name && personal.last_name && personal.age;
  const isAccountValid = account.email?.includes("@");
  const isSkillsValid = skills.length > 0;
  const isExperienceValid = experience.length > 0;
  const isFormValid = isPersonalValid && isAccountValid && isSkillsValid && isExperienceValid;

  const handleSubmit = async () => {
  setLoading(true);
  setError("");

  try {
    // Ensure we are sending the clean profile object
    const payload = {
      profile: {
        personal: state.profile.personal,
        account: state.profile.account,
        skills: state.profile.skills,
        experience: state.profile.experience
      }
    };

    const res = await api.put("/profile", payload);

    dispatch({ type: "SET_PROFILE", payload: res.data.profile });
    localStorage.removeItem("currentStep");
    dispatch({ type: "GO_TO_STEP", step: 5 });
    
  } catch (err) {
    console.error("Submission Error Details:", err.response?.data);
    setError(err.response?.data?.message || "Submission failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Review Your Profile</h2>

      {/* Personal */}
      <section className={`${styles.section} ${isPersonalValid ? styles.valid : styles.invalid}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Personal Info</span>
          {!isPersonalValid && <span className={styles.incompleteText}>⚠️ Missing Data</span>}
        </div>
        <p><strong>Name:</strong> {personal.first_name} {personal.middle_name} {personal.last_name}</p>
        <p><strong>Age:</strong> {personal.age}</p>
        <button onClick={() => dispatch({ type: "GO_TO_STEP", step: 1 })} className={styles.editButton}>Edit</button>
      </section>

      {/* Experience */}
      <section className={`${styles.section} ${isExperienceValid ? styles.valid : styles.invalid}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Experience</span>
          {!isExperienceValid && <span className={styles.incompleteText}>⚠️ Add Experience</span>}
        </div>
        <ul className={styles.list}>
          {experience.map((e, i) => <li key={i}>{e.company} ({e.years} yrs)</li>)}
        </ul>
        <button onClick={() => dispatch({ type: "GO_TO_STEP", step: 2 })} className={styles.editButton}>Edit</button>
      </section>

      {/* Skills */}
      <section className={`${styles.section} ${isSkillsValid ? styles.valid : styles.invalid}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Skills</span>
          {!isSkillsValid && <span className={styles.incompleteText}>⚠️ Add Skills</span>}
        </div>
        <div>{skills.map((s, i) => <span key={i}>{s}</span>)}</div>
        <button onClick={() => dispatch({ type: "GO_TO_STEP", step: 3 })} className={styles.editButton}>Edit</button>
      </section>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.actions}>
        <button onClick={() => dispatch({ type: "PREV_STEP" })} className={styles.backButton}>Back</button>
        <button onClick={handleSubmit} disabled={!isFormValid || loading} className={styles.submitButton}>
          {loading ? "Saving..." : "Finalize & Submit"}
        </button>
      </div>
    </div>
  );
}
