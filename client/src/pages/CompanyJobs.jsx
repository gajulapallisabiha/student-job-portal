import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login as a company first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/jobs/my-jobs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("MY COMPANY JOBS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("COMPANY JOBS ERROR:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job");
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job._id !== jobId)
      );

      alert("Job deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>My Posted Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>My Posted Jobs</h1>

      <Link to="/company-dashboard">
        <button style={styles.button}>Back to Dashboard</button>
      </Link>

      <Link to="/post-job">
        <button style={styles.button}>Post New Job</button>
      </Link>

      {message && <p style={styles.error}>{message}</p>}

      {!message && jobs.length === 0 && (
        <div>
          <p>You have not posted any jobs yet.</p>
          <Link to="/post-job">
            <button style={styles.button}>Post Your First Job</button>
          </Link>
        </div>
      )}

      {jobs.map((job) => (
        <div key={job._id} style={styles.card}>
          <h2>{job.title}</h2>

          <p><strong>Company:</strong> {job.company}</p>

          <p>
            <strong>Description:</strong>
            <br />
            {job.description}
          </p>

          <p><strong>Location:</strong> {job.location}</p>

          <p>
            <strong>Salary / Stipend:</strong>{" "}
            {job.salary || "Not specified"}
          </p>

          <p>
            <strong>Job Type:</strong>{" "}
            {job.type || "Not specified"}
          </p>

          <p>
            <strong>Application Deadline:</strong>{" "}
            {job.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "Not specified"}
          </p>

          <Link to={`/company-jobs/${job._id}/applications`}>
            <button style={styles.button}>View Applicants</button>
          </Link>

          <button
            style={styles.deleteButton}
            onClick={() => handleDelete(job._id)}
          >
            Delete Job
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "10px",
    maxWidth: "700px",
  },
  button: {
    padding: "10px 16px",
    margin: "10px 10px 10px 0",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "10px 16px",
    margin: "10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "20px",
  },
};

export default CompanyJobs;
