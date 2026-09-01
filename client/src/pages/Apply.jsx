import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Apply() {
  const navigate = useNavigate();
  const location = useLocation();

  const job = location.state?.job;

  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!coverLetter.trim()) {
      setError("Please enter a cover letter.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before applying.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: job._id,
            coverLetter: coverLetter,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application failed");
      }

      setMessage("Application submitted successfully!");

      setCoverLetter("");

      setTimeout(() => {
        navigate("/applications");
      }, 1500);
    } catch (error) {
      console.error("Application error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={() => navigate("/jobs")}
          style={{
            marginBottom: "20px",
            padding: "8px 15px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back to Jobs
        </button>

        <h1>Apply for Job</h1>

        <h2>{job.title}</h2>

        <h3>{job.company}</h3>

        <p>
          <strong>Location:</strong> {job.location}
        </p>

        <p>
          <strong>Type:</strong> {job.type}
        </p>

        <hr />

        <form onSubmit={handleSubmit}>
          <label>
            <strong>Cover Letter</strong>
          </label>

          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write why you are interested in this position..."
            rows="8"
            style={{
              width: "100%",
              marginTop: "10px",
              marginBottom: "20px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "green" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Apply;