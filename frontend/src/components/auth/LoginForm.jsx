import { useState } from "react";
import api from "../../utils/api";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValid) return setError("Please fill in email and password.");

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, profile } = res.data;

      // Call parent function to update context + localStorage
      onLogin(profile, token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleLogin}>
      <h2>Login</h2>

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

      <button type="submit" disabled={!isValid || loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>
        Don't have an account? <span onClick={switchToSignup}>Sign up here</span>
      </p>
    </form>
  );
}
