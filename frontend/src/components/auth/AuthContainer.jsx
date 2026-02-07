import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import styles from "./AuthContainer.module.css";

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {isLogin ? (
          <LoginForm
            onLogin={() => alert("Logged in! (mock)")}
            switchToSignup={switchToSignup}
          />
        ) : (
          <SignupForm
            onSignup={() => alert("Signed up! (mock)")}
            switchToLogin={switchToLogin}
          />
        )}
      </div>
    </div>
  );
}
