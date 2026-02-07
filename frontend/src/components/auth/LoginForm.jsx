import { useState } from "react";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || password.length < 6) {
      setError("Invalid email or password");
      return;
    }

    setError("");
    onLogin();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Welcome Back</h2>

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

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit">Login</button>

      <p className={styles.switch}>
        Don’t have an account?{" "}
        <span onClick={switchToSignup}>Sign up here</span>
      </p>
    </form>
  );
}
