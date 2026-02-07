import { useState } from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./ExperienceStep.module.css";

export default function ExperienceStep() {
  const { state, dispatch } = useProfile();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");

  const addExperience = () => {
    if (!company || !role || !years) return;

    dispatch({
      type: "ADD_EXPERIENCE",
      value: { company, role, years }
    });

    setCompany("");
    setRole("");
    setYears("");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Experience</h2>

      <div className={styles.fieldGroup}>
        <input
          className={styles.input}
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
      </div>

      <button className={styles.addButton} onClick={addExperience}>
        Add Experience
      </button>

      <ul className={styles.list}>
        {state.profile.experience.map((exp, index) => (
          <li key={index} className={styles.listItem}>
            <span>
              {exp.company} — {exp.role} ({exp.years} yrs)
            </span>
            <button
              className={styles.removeButton}
              onClick={() =>
                dispatch({ type: "REMOVE_EXPERIENCE", index })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.backButton}`}
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          Back
        </button>

        <button
          className={`${styles.button} ${styles.nextButton}`}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
        >
          Next
        </button>
      </div>
    </div>
  );
}
