import { useState } from "react";
import styles from "./SignupForm.module.css";

export default function SignupForm({ onSignup, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || password.length < 6 || password !== confirm) {
      setError("Please fix the errors above");
      return;
    }

    setError("");
    onSignup();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
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

      <button type="submit">Sign Up</button>

      <p className={styles.switch}>
        Already have an account?{" "}
        <span onClick={switchToLogin}>Login here</span>
      </p>
    </form>
  );
}
