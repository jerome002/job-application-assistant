import React from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./PersonalStep.module.css";

export default function PersonalStep() {
  const { state, dispatch } = useProfile();
  const { personal } = state.profile;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_PERSONAL", payload: { [name]: value } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Personal Information</h2>
          <p className={styles.subtitle}>Enter your details exactly as you'd like them to appear on your profile.</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="first_name">First Name</label>
            <input 
              id="first_name"
              name="first_name" 
              value={personal.first_name || ""} 
              onChange={handleChange} 
              placeholder="e.g. John" 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="last_name">Last Name</label>
            <input 
              id="last_name"
              name="last_name" 
              value={personal.last_name || ""} 
              onChange={handleChange} 
              placeholder="e.g. Doe" 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="location">Location</label>
            <input 
              id="location"
              name="location" 
              value={personal.location || ""} 
              onChange={handleChange} 
              placeholder="London, UK" 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input 
              id="phone"
              name="phone" 
              value={personal.phone || ""} 
              onChange={handleChange} 
              placeholder="+44 7700 900000" 
            />
          </div>
        </div>

        <button 
          className={styles.submitBtn} 
          onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}