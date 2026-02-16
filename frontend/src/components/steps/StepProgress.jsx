import { useProfile } from "../../context/AppContext";
import styles from "./StepProgress.module.css";

const STEPS = ["Personal", "Skills", "Experience", "Review"];

export default function StepProgress() {
  const { state, dispatch } = useProfile();
  const currentStep = state.step;

  const handleStepClick = (stepNumber) => {
    // Navigation Safety: Users can only jump to steps they've seen or the very next one
    if (stepNumber <= currentStep + 1 && stepNumber < 5) {
      dispatch({ type: "SET_STEP", payload: stepNumber });
    }
  };

  return (
    <div className={styles.container}>
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div 
            key={label} 
            className={`${styles.step} ${isCompleted || isActive ? styles.clickable : ""}`}
            onClick={() => handleStepClick(stepNumber)}
          >
            <div className={`${styles.circle} ${isActive ? styles.active : ""} ${isCompleted ? styles.completed : ""}`}>
              {isCompleted ? "✓" : stepNumber}
            </div>
            <span className={styles.label}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}