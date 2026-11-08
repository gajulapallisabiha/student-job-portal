
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    type: "Internship",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const requiredFields = {
      "Job Title": formData.title,
      Company: formData.company,
      Description: formData.description,
      Location: formData.location,
      "Job Type": formData.type,
      "Application Deadline": formData.deadline,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || !value.trim())
      .map(([name]) => name);

    console.log("Current form data:", formData);
    console.log("Missing fields:", missingFields);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login as a company.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          company: formData.company.trim(),
          description: formData.description.trim(),
          location: formData.location.trim(),
          salary: formData.salary.trim() || "Not specified",
          type: formData.type,
          deadline: formData.deadline,
        }),
      });

      const data = await response.json();

      console.log("POST JOB RESPONSE:", data);

      if (!response.ok) {
        setError(data.message || "Failed to post job.");
        return;
      }

      setSuccess("Job posted successfully!");

      setFormData({
        title: "",
        company: "",
        description: "",
        location: "",
        salary: "",
        type: "Internship",
        deadline: "",
      });

      setTimeout(() => {
        navigate("/company-jobs");
      }, 1200);
    } catch (err) {
      console.error("POST JOB ERROR:", err);

      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      <div className="post-job-card">
        <h1>Post a Job</h1>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: React Developer Intern"
              required
            />
          </div>

          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job, responsibilities and requirements"
              required
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Bengaluru / Remote"
              required
            />
          </div>

          <div className="form-group">
            <label>Salary / Stipend</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Example: ₹20,000/month"
            />
          </div>

          <div className="form-group">
            <label>Job Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div className="form-group">
            <label>Application Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>

            <Link
              to="/company-dashboard"
              className="secondary-button"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
