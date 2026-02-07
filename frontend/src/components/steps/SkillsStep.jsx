import { useState } from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./SkillsStep.module.css";

export default function SkillsStep() {
  const { state, dispatch } = useProfile();
  const [skill, setSkill] = useState("");

  const isValid = state.profile.skills.length > 0;

  const addSkill = () => {
    if (skill.trim() === "") return;

    dispatch({
      type: "ADD_SKILL",
      value: skill
    });

    setSkill("");
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

        <button className={styles.addButton} onClick={addSkill}>
          Add
        </button>
      </div>

      <ul className={styles.list}>
        {state.profile.skills.map((s, index) => (
          <li key={index} className={styles.listItem}>
            <span>{s}</span>
            <button
              className={styles.removeButton}
              onClick={() =>
                dispatch({
                  type: "REMOVE_SKILL",
                  index
                })
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
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}
