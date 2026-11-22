
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          role,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const loggedUser = data.user;

      if (
        loggedUser?.role?.toUpperCase() === "COMPANY" ||
        role === "COMPANY"
      ) {
        navigate("/company-dashboard");
      } else {
        navigate("/jobs");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-layout">
        {/* LEFT WELCOME SECTION */}
        <div className="login-welcome">
          <div className="login-brand">
            <div className="login-brand-icon">✦</div>
            <span>JobPortal</span>
          </div>

          <div className="login-welcome-content">
            <span className="login-eyebrow">
              YOUR CAREER STARTS HERE
            </span>

            <h1>
              Unlock your
              <span> next opportunity.</span>
            </h1>

            <p>
              Connect with leading companies, discover exciting
              opportunities and take the next step in your career
              journey.
            </p>

            <div className="login-highlights">
              <div className="login-highlight">
                <span className="highlight-icon">01</span>
                <div>
                  <strong>Discover Opportunities</strong>
                  <small>Explore internships and jobs.</small>
                </div>
              </div>

              <div className="login-highlight">
                <span className="highlight-icon">02</span>
                <div>
                  <strong>Track Your Progress</strong>
                  <small>Stay updated on applications.</small>
                </div>
              </div>

              <div className="login-highlight">
                <span className="highlight-icon">03</span>
                <div>
                  <strong>Build Your Future</strong>
                  <small>Connect with the right employers.</small>
                </div>
              </div>
            </div>
          </div>

          <div className="login-footer-text">
            Building connections. Creating opportunities.
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-card-top">
              <span className="login-card-label">WELCOME BACK</span>
              <div className="login-card-symbol">✦</div>
            </div>

            <h2>Sign in to your account</h2>

            <p className="login-subtitle">
              Enter your details to continue to JobPortal.
            </p>

            <form onSubmit={handleLogin}>
              <label>Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✉</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <label>Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">⌑</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <label>Continue as</label>

              <div className="login-role-selector">
                <button
                  type="button"
                  className={`login-role-option ${
                    role === "STUDENT" ? "active" : ""
                  }`}
                  onClick={() => setRole("STUDENT")}
                >
                  <span className="role-symbol">S</span>
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  className={`login-role-option ${
                    role === "COMPANY" ? "active" : ""
                  }`}
                  onClick={() => setRole("COMPANY")}
                >
                  <span className="role-symbol">C</span>
                  <span>Company</span>
                </button>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="login-register">
              Don't have an account?
              <Link to="/register"> Create Account</Link>
            </div>

            <div className="login-secure">
              Secure access to your JobPortal account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
