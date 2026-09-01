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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
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
        }
      );

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        setError(
          data.message || "Registration failed."
        );
        return;
      }

      // Save login information
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      alert("Registration successful!");

      // Redirect according to role
      if (data.user?.role === "COMPANY") {
        navigate("/company-dashboard");
      } else {
        navigate("/jobs");
      }

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        "Unable to connect to server. Please make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join the Student Job Portal
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="form-group">

            <label>
              Full Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

          </div>


          <div className="form-group">

            <label>
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

          </div>


          <div className="form-group">

            <label>
              Password *
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />

          </div>


          <div className="form-group">

            <label>
              Register As *
            </label>

            <div className="role-buttons">

              <button
                type="button"
                className={
                  formData.role === "STUDENT"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "STUDENT",
                  })
                }
              >
                👨‍🎓 Student
              </button>


              <button
                type="button"
                className={
                  formData.role === "COMPANY"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "COMPANY",
                  })
                }
              >
                🏢 Company
              </button>

            </div>

          </div>


          <button
            type="submit"
            className="primary-button"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>


        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#64748b",
          }}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            style={{
              color: "#4f46e5",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;

