import { useState } from "react";
import styles from "./LoginForm.module.css";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValid = email.trim() !== "" && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return setError("Please fill in valid email and password.");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login",{ email, password });
      const { token, profile } = res.data;

      // Save JWT token
      localStorage.setItem("token", token);
      localStorage.setItem("profile", JSON.stringify(profile));

      setError("");
      onLogin(profile); // notify App that login is successful
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <button type="submit" disabled={!isValid}>Login</button>
      <p>
        Don’t have an account? <span className={styles.link} onClick={() => onLogin("signup")}>Sign up here</span>
      </p>
    </form>
  );
}
