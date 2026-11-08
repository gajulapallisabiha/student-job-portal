
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load jobs");
        }

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Jobs error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleApply = (job) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/apply", {
      state: { job: job },
    });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <h1>Available Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>Available Jobs</h1>

        <Link to="/my-applications" style={styles.link}>
          My Applications
        </Link>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {jobs.length === 0 && !error && (
        <p>No jobs available.</p>
      )}

      <div style={styles.jobList}>
        {jobs.map((job) => (
          <div key={job._id} style={styles.jobCard}>
            <h2>{job.title}</h2>

            <p>
              <strong>Company:</strong>{" "}
              {job.company || job.companyName || "Not specified"}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {job.description || "No description"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {job.location || "Not specified"}
            </p>

            <p>
              <strong>Type:</strong>{" "}
              {job.type || "Not specified"}
            </p>

            <button
              onClick={() => handleApply(job)}
              style={styles.applyButton}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f5f7fb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },

  link: {
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "7px",
    textDecoration: "none",
  },

  jobList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },

  jobCard: {
    background: "white",
    border: "1px solid #ddd",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
  },

  applyButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  error: {
    color: "red",
  },
};

export default Jobs;
