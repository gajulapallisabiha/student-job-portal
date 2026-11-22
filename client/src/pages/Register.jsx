
import "./Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert("Registration successful!");

      if (data.user?.role === "COMPANY") {
        navigate("/company-dashboard");
      } else {
        navigate("/jobs");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      setError("Unable to connect to server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-layout">

        {/* LEFT SIDE */}
        <div className="register-welcome">
          <div className="register-brand">
            <span className="register-brand-icon">✦</span>
            <span>JobPortal</span>
          </div>

          <div className="register-welcome-content">
            <span className="register-eyebrow">
              START YOUR JOURNEY
            </span>

            <h1>
              Your next
              <span> opportunity </span>
              starts here.
            </h1>

            <p>
              Create your account and connect with opportunities,
              companies, and talented people.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <span className="benefit-symbol">01</span>
                <div>
                  <h3>Discover Opportunities</h3>
                  <p>Explore jobs and internships that match your goals.</p>
                </div>
              </div>

              <div className="register-benefit">
                <span className="benefit-symbol">02</span>
                <div>
                  <h3>Build Your Career</h3>
                  <p>Track applications and manage your career journey.</p>
                </div>
              </div>

              <div className="register-benefit">
                <span className="benefit-symbol">03</span>
                <div>
                  <h3>Connect with Talent</h3>
                  <p>Companies can find and connect with skilled students.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="register-footer">
            Find opportunities. Create possibilities.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="register-form-section">
          <div className="register-card">

            <div className="register-card-heading">
              <span className="register-top-label">
                JOIN OUR COMMUNITY
              </span>

              <h2>Create Account</h2>

              <p>
                Fill in your details to get started.
              </p>
            </div>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="register-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="register-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="register-form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (minimum 6 characters)"
                  autoComplete="new-password"
                  minLength="6"
                  required
                />
              </div>

              <div className="register-form-group">
                <label>Register As</label>

                <div className="register-role-options">
                  <button
                    type="button"
                    className={`register-role-card ${
                      formData.role === "STUDENT" ? "selected" : ""
                    }`}
                    aria-pressed={formData.role === "STUDENT"}
                    onClick={() => handleRoleChange("STUDENT")}
                  >
                    <span className="register-role-letter">S</span>
                    <span className="register-role-name">Student</span>
                    <span className="register-role-description">
                      Find jobs & internships
                    </span>
                    {formData.role === "STUDENT" && (
                      <span className="register-role-check">✓</span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`register-role-card ${
                      formData.role === "COMPANY" ? "selected" : ""
                    }`}
                    aria-pressed={formData.role === "COMPANY"}
                    onClick={() => handleRoleChange("COMPANY")}
                  >
                    <span className="register-role-letter">C</span>
                    <span className="register-role-name">Company</span>
                    <span className="register-role-description">
                      Hire talented students
                    </span>
                    {formData.role === "COMPANY" && (
                      <span className="register-role-check">✓</span>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="register-submit-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create My Account"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="register-login-link">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </div>

            <div className="register-secure-note">
              Your account details are used to create your portal profile.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
