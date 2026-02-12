import { useState } from "react";
import axios from "axios";
import styles from "./SignupForm.module.css";

export default function SignupForm({ onSignup, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid =
    email.trim() !== "" && password.length >= 6 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("Submit clicked");

    if (!isValid) {
      setError("Please fix the errors above.");
      return;
    }

    try {
     // console.log("Sending request to backend...");
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { email, password }
      );

      const { token, profile } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("profile", JSON.stringify(profile));

      onSignup(profile);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p>
        Already have an account?{" "}
        <span onClick={switchToLogin}>Login here</span>
      </p>
    </form>
  );
}
