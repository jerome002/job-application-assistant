import { useState } from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./PersonalStep.module.css";

export default function PersonalStep() {
  const { state, dispatch } = useProfile();
  const [error, setError] = useState("");

  const personal = state?.profile?.personal || { first_name: "", middle_name: "", last_name: "", age: "" };

  const handleNext = () => {
    // Detailed validation with specific error messages
    if (!personal.first_name?.trim()) {
      setError("First name is required.");
      return;
    }
    if (!personal.last_name?.trim()) {
      setError("Last name is required.");
      return;
    }
    if (!personal.age || isNaN(personal.age) || Number(personal.age) <= 0) {
      setError("Please enter a valid age greater than 0.");
      return;
    }

    setError("");
    dispatch({ type: "NEXT_STEP" });
  };

  const handleChange = (field) => (e) => {
    dispatch({ 
      type: "UPDATE_FIELD", 
      section: "personal", 
      field, 
      value: e.target.value 
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Personal Information</h2>
      <div className={styles.fieldGroup}>
        <input 
          className={styles.input} 
          placeholder="First Name *" 
          value={personal.first_name} 
          onChange={handleChange("first_name")} 
        />
        <input 
          className={styles.input} 
          placeholder="Middle Name (Optional)" 
          value={personal.middle_name} 
          onChange={handleChange("middle_name")} 
        />
        <input 
          className={styles.input} 
          placeholder="Last Name *" 
          value={personal.last_name} 
          onChange={handleChange("last_name")} 
        />
        <input 
          className={styles.input} 
          placeholder="Age *" 
          type="number" 
          value={personal.age} 
          onChange={handleChange("age")} 
        />
      </div>
      {error && <p className={styles.error} style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>}
      <div className={styles.actions}>
        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}