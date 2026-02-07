import { useProfile } from "../../context/AppContext";
import styles from "./StepProgress.module.css";

const STEPS = [
  "Personal",
  "Account",
  "Skills",
  "Experience",
  "Review"
];

export default function StepProgress() {
  const { state } = useProfile();
  const currentStep = state.step;

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
          <div key={label} className={styles.step}>
            <div className={`${styles.circle} ${styles[status]}`}>
              {stepNumber}
            </div>
            <span className={styles.label}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
