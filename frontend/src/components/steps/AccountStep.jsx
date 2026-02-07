import { useProfile } from "../../context/AppContext";

export default function AccountStep() {
  const {state,dispatch}= useProfile();

  const isAccountValid =
    state.profile.account.email.trim() !== "" &&
    state.profile.account.password.length >=6;
  return (
    <>
      <h2>Account Information</h2>

      <input
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

      <button onClick={() => dispatch({ type: "PREV_STEP" })}>
        Back
      </button>

      <button onClick={() => dispatch({ type: "NEXT_STEP" })} disabled={!isAccountValid}>
        Next
      </button>
    </>
  );
}
