
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Apply() {
  const navigate = useNavigate();
  const location = useLocation();

  const job = location.state?.job;

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!job) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Job information not found</h2>
        <button onClick={() => navigate("/jobs")}>
          Back to Jobs
        </button>
      </div>
    );
  }

  const handleResumeChange = (e) => {
    setError("");
    setResume(null);

    const file = e.target.files[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!coverLetter.trim()) {
      setError("Please enter your cover letter.");
      return;
    }

    if (!resume) {
      setError("Please upload your PDF resume.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before applying.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("jobId", job._id);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application failed");
      }

      setMessage("Application submitted successfully!");
      setCoverLetter("");
      setResume(null);

      setTimeout(() => {
        navigate("/my-applications");
      }, 1500);

    } catch (err) {
      console.error("Application error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button
          onClick={() => navigate("/jobs")}
          style={styles.backButton}
        >
          ← Back to Jobs
        </button>

        <h1>Apply for Job</h1>

        <h2>{job.title}</h2>
        <h3>{job.company}</h3>

        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Type:</strong> {job.type}</p>

        <hr />

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Cover Letter
          </label>

          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write why you are interested in this position..."
            rows="7"
            style={styles.textarea}
          />

          <label style={styles.label}>
            Upload Resume (PDF only)
          </label>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleResumeChange}
            style={styles.fileInput}
          />

          <p style={styles.helpText}>
            Upload your resume in PDF format. Maximum size: 5 MB.
          </p>

          {resume && (
            <p style={styles.success}>
              Selected file: {resume.name}
            </p>
          )}

          {error && (
            <p style={styles.error}>{error}</p>
          )}

          {message && (
            <p style={styles.success}>{message}</p>
          )}

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
  },

  container: {
    maxWidth: "700px",
    margin: "0 auto",
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  },

  backButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "15px",
  },

  label: {
    display: "block",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    resize: "vertical",
    marginBottom: "10px",
    fontSize: "15px",
  },

  fileInput: {
    display: "block",
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxSizing: "border-box",
    background: "#f9fafb",
  },

  helpText: {
    color: "#666",
    fontSize: "13px",
  },

  buttonContainer: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
  },

  submitButton: {
    flex: 1,
    padding: "13px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  cancelButton: {
    padding: "13px 25px",
    background: "#e5e7eb",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginTop: "15px",
  },

  success: {
    color: "green",
    marginTop: "15px",
  },
};

export default Apply;
