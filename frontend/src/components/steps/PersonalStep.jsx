import { useProfile } from "../../context/AppContext";

export default function PersonalStep() {
  const {state, dispatch}= useProfile();

  const isPersonalValid =
    state.profile.personal.first_name.trim() !== "" &&
    state.profile.personal.last_name.trim() !== "" &&
    state.profile.personal.age.trim() !== "";

  return (
    <>
      <h2>Personal Information</h2>

      <input
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

      <button onClick={() => dispatch({ type: "NEXT_STEP" })} disabled={!isPersonalValid}>
        Next
      </button>
    </>
  );
}
