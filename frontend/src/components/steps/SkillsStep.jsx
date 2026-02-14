import { useState } from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./SkillsStep.module.css";
import api from "../../utils/api"; // Axios instance with JWT token

export default function SkillsStep() {
  const { state, dispatch } = useProfile();
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prevent "Next" unless at least one skill
  const isValid = state.profile.skills.length > 0;

  // Add a skill locally
  const addSkill = () => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) {
      setError("Skill cannot be empty.");
      return;
    }

    // Prevent duplicate skills
    if (state.profile.skills.includes(trimmedSkill)) {
      setError("This skill has already been added.");
      return;
    }

    dispatch({ type: "ADD_SKILL", value: trimmedSkill });
    setSkill("");
    setError("");
  };

  // Save skills to backend and move to next step
  const handleNext = async () => {
    if (!isValid) {
      setError("Please add at least one skill.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.put("/profile/skills", { skills: state.profile.skills });

      // Update frontend state with backend response
      dispatch({ type: "SET_SKILLS", value: res.data.skills });

      // Move to next step
      dispatch({ type: "NEXT_STEP" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Skills</h2>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="Add a skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <button className={styles.addButton} type="button" onClick={addSkill}>
          Add
        </button>
      </div>

      <ul className={styles.list}>
        {state.profile.skills.map((s, index) => (
          <li key={index} className={styles.listItem}>
            <span>{s}</span>
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => dispatch({ type: "REMOVE_SKILL", index })}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.backButton}`}
          type="button"
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          Back
        </button>

        <button
          className={`${styles.button} ${styles.nextButton}`}
          type="button"
          onClick={handleNext}
          disabled={!isValid || loading}
        >
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
}
