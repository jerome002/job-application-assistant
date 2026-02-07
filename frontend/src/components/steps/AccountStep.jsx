import { useProfile } from "../../context/AppContext";
import styles from "./AccountStep.module.css";

export default function AccountStep() {
  const { state, dispatch } = useProfile();

  const isAccountValid =
    state.profile.account.email.trim() !== "" &&
    state.profile.account.password.length >= 6;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Account Information</h2>

      <div className={styles.fieldGroup}>
        <input
          className={styles.input}
          placeholder="Email"
          value={state.profile.account.email}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              section: "account",
              field: "email",
              value: e.target.value
            })
          }
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={state.profile.account.password}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              section: "account",
              field: "password",
              value: e.target.value
            })
          }
        />
      </div>

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
          disabled={!isAccountValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}
