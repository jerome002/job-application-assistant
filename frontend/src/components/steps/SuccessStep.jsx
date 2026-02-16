import React from 'react';
import { useProfile } from "../../context/AppContext";
import styles from './SuccessStep.module.css';

export default function SuccessStep() {
  const { dispatch } = useProfile();

  const handleFinish = () => {
    // Moves the App state to Step 6, which triggers the JobDashboard
    dispatch({ type: "SET_STEP", payload: 6 });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          ✓
        </div>
        <h2 className={styles.title}>All Set!</h2>
        <p className={styles.message}>
          Your professional profile has been created successfully. 
          You're ready to start your job application journey.
        </p>
        
        <button 
          className={styles.dashboardBtn}
          onClick={handleFinish}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}