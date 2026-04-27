import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Welcome Back</h1>
        <p style={styles.subtext}>Login to access the FIS</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>Enter your account details</p>

        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          style={styles.input}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          style={styles.input}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.footerText}>
          Forgot password? <span style={styles.link}>Reset here</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },

  header: {
    textAlign: "center",
    marginBottom: "36px",
    position: "relative",
    zIndex: 1,
  },

  heading: {
    fontSize: "56px",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0",
    lineHeight: "1.1",
  },

  subtext: {
    marginTop: "12px",
    fontSize: "20px",
    color: "#cbd5e1",
  },

  card: {
    width: "420px",
    padding: "42px",
    borderRadius: "22px",
    background: "#ffffff",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
    position: "relative",
    zIndex: 2,
  },

  title: {
    fontSize: "34px",
    margin: "0",
    textAlign: "center",
    color: "#0f172a",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "8px",
    marginBottom: "34px",
    fontSize: "16px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontWeight: "700",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "15px 16px",
    marginBottom: "22px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    position: "relative",
    zIndex: 3,
    pointerEvents: "auto",
  },

  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    position: "relative",
    zIndex: 3,
  },

  footerText: {
    marginTop: "24px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
  },

  error: {
    color: "#ef4444",
    fontSize: "14px",
    marginBottom: "8px",
    textAlign: "center",
  },
};

export default Login;