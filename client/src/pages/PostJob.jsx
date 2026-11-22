
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";
import "./PostJob.css";

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
      <div className="post-job-container">

        <div className="post-job-heading">
          <div>
            <span className="post-job-eyebrow">COMPANY WORKSPACE</span>
            <h1>Create a New Job Opening</h1>
            <p>
              Find the right talent for your team. Share an opportunity
              and connect with talented candidates.
            </p>
          </div>

          <Link to="/company-dashboard" className="post-job-back">
            ← Dashboard
          </Link>
        </div>

        <div className="post-job-layout">

          <div className="post-job-card">
            <div className="post-job-card-heading">
              <div>
                <span className="post-job-step">JOB DETAILS</span>
                <h2>Opportunity Information</h2>
                <p>Fill in the details below to publish your job.</p>
              </div>
              <div className="post-job-heading-icon">✦</div>
            </div>

            {error && (
              <div className="post-job-alert error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="post-job-alert success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="post-job-form-grid">

                <div className="post-job-field full-width">
                  <label>Job Title <span>*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. React Developer Intern"
                    required
                  />
                </div>

                <div className="post-job-field">
                  <label>Company Name <span>*</span></label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div className="post-job-field">
                  <label>Job Location <span>*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru / Remote"
                    required
                  />
                </div>

                <div className="post-job-field">
                  <label>Salary / Stipend</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹20,000/month"
                  />
                </div>

                <div className="post-job-field">
                  <label>Employment Type <span>*</span></label>
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

                <div className="post-job-field full-width">
                  <label>Job Description <span>*</span></label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe responsibilities, requirements, skills and what candidates can expect..."
                    rows="6"
                    required
                  />
                  <small>
                    Provide clear information to help candidates understand
                    the opportunity.
                  </small>
                </div>

                <div className="post-job-field full-width">
                  <label>Application Deadline <span>*</span></label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

              </div>

              <div className="post-job-actions">
                <button
                  type="submit"
                  className="post-job-submit"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Job Opening"}
                  {!loading && <span> →</span>}
                </button>

                <Link
                  to="/company-dashboard"
                  className="post-job-cancel"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          <aside className="post-job-sidebar">

            <div className="post-job-preview-card">
              <span className="preview-label">LIVE PREVIEW</span>
              <div className="preview-icon">✦</div>

              <h3>{formData.title || "Your Job Title"}</h3>

              <p className="preview-company">
                {formData.company || "Your Company"}
              </p>

              <div className="preview-tags">
                <span>{formData.type}</span>
                <span>{formData.location || "Location"}</span>
              </div>

              <div className="preview-divider" />

              <div className="preview-detail">
                <span>Salary / Stipend</span>
                <strong>{formData.salary || "Not specified"}</strong>
              </div>

              <div className="preview-detail">
                <span>Application Deadline</span>
                <strong>{formData.deadline || "Not selected"}</strong>
              </div>

              <div className="preview-divider" />

              <span className="preview-description-title">
                About this opportunity
              </span>

              <p className="preview-description">
                {formData.description
                  ? formData.description
                  : "Your job description will appear here as you fill in the form."}
              </p>
            </div>

            <div className="post-job-tip-card">
              <div className="tip-icon">✧</div>
              <h3>Make your listing stand out</h3>
              <p>
                A clear job title, detailed description and accurate
                requirements help attract suitable candidates.
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
