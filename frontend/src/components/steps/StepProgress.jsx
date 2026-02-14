import { useProfile } from "../../context/AppContext";
import styles from "./StepProgress.module.css";

const STEPS = [
  "Personal",
  "Skills",
  "Experience",
  "Review"
];

export default function StepProgress() {
  const { state, dispatch } = useProfile(); // Added dispatch
  const currentStep = state.step;

  const handleStepClick = (stepNumber) => {
    // Basic Rule: Allow jumping back always. 
    // Allow jumping forward only to steps the user has already reached.
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      dispatch({ type: "GO_TO_STEP", step: stepNumber });
    }
  };

  return (
    <div className={styles.container}>
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;

        const status =
          stepNumber < currentStep
            ? "completed"
            : stepNumber === currentStep
            ? "active"
            : "upcoming";

        return (
          <div 
            key={label} 
            className={`${styles.step} ${stepNumber <= currentStep ? styles.clickable : ""}`}
            onClick={() => handleStepClick(stepNumber)}
          >
            <div className={`${styles.circle} ${styles[status]}`}>
              {stepNumber < currentStep ? "✓" : stepNumber}
            </div>
            <span className={`${styles.label} ${styles[status]}`}>{label}</span>
            
            {/* Optional: Add a connector line between circles */}
            {index < STEPS.length - 1 && <div className={styles.line} />}
          </div>
        );
      })}
    </div>
  );
}