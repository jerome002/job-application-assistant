import { useState } from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./AccountStep.module.css";
import api from "../../utils/api";


export default function AccountStep() {
  const { state, dispatch } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const account = state?.profile?.account || { email: "", password: "" };

  const isAccountValid =
    account.email?.trim() !== "" && 
    account.email?.includes("@") &&
    account.password?.length >= 6;

  const handleSignup = async () => {
    if (!isAccountValid) {
      setError("Valid email and password (min 6 chars) required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/signup", {
        email: account.email.trim(),
        password: account.password,
        personal: state.profile.personal
      });

      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOAD_PROFILE", payload: res.data.profile });
      dispatch({ type: "LOGIN_SUCCESS" });
      dispatch({ type: "NEXT_STEP" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Account Information</h2>
      <div className={styles.fieldGroup}>
        <input className={styles.input} placeholder="Email" type="email" value={account.email} 
          onChange={(e) => dispatch({ type: "UPDATE_FIELD", section: "account", field: "email", value: e.target.value })} />
        <input className={styles.input} type="password" placeholder="Password (min 6 chars)" value={account.password}
          onChange={(e) => dispatch({ type: "UPDATE_FIELD", section: "account", field: "password", value: e.target.value })} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.backButton}`} onClick={() => dispatch({ type: "PREV_STEP" })}>Back</button>
        <button className={`${styles.button} ${styles.nextButton}`} onClick={handleSignup} disabled={loading}>{loading ? "Saving..." : "Sign Up"}</button>
      </div>
    </div>
  );
}