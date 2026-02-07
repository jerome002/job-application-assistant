import { useProfile } from "../../context/AppContext";
import styles from "./PersonalStep.module.css";

export default function PersonalStep() {
  const { state, dispatch } = useProfile();

  const isPersonalValid =
    state.profile.personal.first_name.trim() !== "" &&
    state.profile.personal.last_name.trim() !== "" &&
    state.profile.personal.age.trim() !== "";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Personal Information</h2>

      <div className={styles.fieldGroup}>
        <input
          className={styles.input}
          placeholder="First Name"
          value={state.profile.personal.first_name}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              section: "personal",
              field: "first_name",
              value: e.target.value
            })
          }
        />

        <input
          className={styles.input}
          placeholder="Middle Name"
          value={state.profile.personal.middle_name}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              section: "personal",
              field: "middle_name",
              value: e.target.value
            })
          }
        />

        <input
          className={styles.input}
          placeholder="Last Name"
          value={state.profile.personal.last_name}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              section: "personal",
              field: "last_name",
              value: e.target.value
            })
          }
        />

        <input
          className={styles.input}
          placeholder="Age"
          value={state.profile.personal.age}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              section: "personal",
              field: "age",
              value: e.target.value
            })
          }
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          disabled={!isPersonalValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}
