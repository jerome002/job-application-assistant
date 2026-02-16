import { useState } from "react";
import api from "../../utils/api";
import styles from "./SignupForm.module.css";

export default function SignupForm({ onSignup, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = email.trim() !== "" && password.length >= 6 && password === confirm;

  const handleSignup = async (e) => {
  e.preventDefault();
  if (!isValid) return setError("Please fix the errors above.");

  setLoading(true);
  setError("");

  try {
    const res = await api.post("/auth/signup", { 
      email: email.toLowerCase().trim(), 
      password,
      // Pass an empty profile structure so the backend doesn't crash
      personal: { first_name: "", last_name: "", age: "" } 
    });
    
    const { token, profile } = res.data;
    onSignup(profile, token);
  } catch (err) {
    // Look at the console to see the REAL error from the backend
    console.error("Signup Error Details:", err.response?.data);
    setError(err.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <form className={styles.form} onSubmit={handleSignup}>
      <h2>Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={!isValid || loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>

      <p>
        Already have an account? <span onClick={switchToLogin}>Login here</span>
      </p>
    </form>
  );
}
