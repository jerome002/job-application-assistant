import { useProfile } from "../../context/AppContext";
import styles from "./ReviewStep.module.css";

export default function ReviewStep() {
  const { state, dispatch } = useProfile();
  const { personal, account, skills, experience } = state.profile;

  /* ---------- VALIDATION ---------- */

  const isPersonalValid =
    personal.first_name &&
    personal.last_name &&
    personal.age;

  const isAccountValid =
    account.email &&
    account.password;

  const isSkillsValid = skills.length > 0;
  const isExperienceValid = experience.length > 0;

  const isFormValid =
    isPersonalValid &&
    isAccountValid &&
    isSkillsValid &&
    isExperienceValid;

  /* ---------- SUBMIT ---------- */

  const handleSubmit = () => {
    if (!isFormValid) return;

    console.log("SUBMITTED PROFILE:", state.profile);
    alert("Profile submitted successfully!");
    dispatch({ type: "RESET" });
  };

  /* ---------- UI ---------- */

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Review Your Profile</h2>

      {/* PERSONAL */}
      <section
        className={`${styles.section} ${
          isPersonalValid ? styles.valid : styles.invalid
        }`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Personal</span>
          {!isPersonalValid && (
            <span className={styles.incomplete}>Incomplete</span>
          )}
        </div>

        <p>{personal.first_name} {personal.last_name}</p>
        <p>Age: {personal.age || "—"}</p>

        <button
          className={styles.editButton}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: 1 })}
        >
          Edit
        </button>
      </section>

      {/* ACCOUNT */}
      <section
        className={`${styles.section} ${
          isAccountValid ? styles.valid : styles.invalid
        }`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Account</span>
          {!isAccountValid && (
            <span className={styles.incomplete}>Incomplete</span>
          )}
        </div>

        <p>Email: {account.email || "—"}</p>

        <button
          className={styles.editButton}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: 2 })}
        >
          Edit
        </button>
      </section>

      {/* SKILLS */}
      <section
        className={`${styles.section} ${
          isSkillsValid ? styles.valid : styles.invalid
        }`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Skills</span>
          {!isSkillsValid && (
            <span className={styles.incomplete}>Add at least one</span>
          )}
        </div>

        <ul className={styles.list}>
          {skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <button
          className={styles.editButton}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: 3 })}
        >
          Edit
        </button>
      </section>

      {/* EXPERIENCE */}
      <section
        className={`${styles.section} ${
          isExperienceValid ? styles.valid : styles.invalid
        }`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Experience</span>
          {!isExperienceValid && (
            <span className={styles.incomplete}>Add at least one</span>
          )}
        </div>

        <ul className={styles.list}>
          {experience.map((exp, i) => (
            <li key={i}>
              {exp.company} — {exp.role} ({exp.years} yrs)
            </li>
          ))}
        </ul>

        <button
          className={styles.editButton}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: 4 })}
        >
          Edit
        </button>
      </section>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.backButton}`}
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          Back
        </button>

        <button
          className={`${styles.button} ${styles.submitButton}`}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Submit Profile
        </button>
      </div>
    </div>
  );
}
