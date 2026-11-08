import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL, { API_BASE_URL } from "../api";

const statusOptions = [
  "Under Review",
  "Shortlisted",
  "Selected",
  "Rejected",
];

function CompanyApplications() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load applications"
          );
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error(error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  // Update application status
  const updateStatus = async (applicationId, status) => {
    const token = localStorage.getItem("token");

    try {
      setUpdatingId(applicationId);

      const response = await fetch(
        `${API_URL}/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? data.application
            : application
        )
      );

      alert(`Application updated to ${status}`);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "#15803d";
      case "Rejected":
        return "#dc2626";
      case "Shortlisted":
        return "#7c3aed";
      case "Under Review":
        return "#d97706";
      default:
        return "#2563eb";
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <h1>Job Applicants</h1>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1>Job Applicants</h1>

        <Link to="/company-jobs" style={styles.backLink}>
          ← Back to My Posted Jobs
        </Link>

        {message && (
          <p style={styles.error}>{message}</p>
        )}

        {!message && applications.length === 0 && (
          <div style={styles.empty}>
            <h2>No Applications Yet</h2>
            <p>No students have applied for this job yet.</p>
          </div>
        )}

        {applications.map((application) => {
          const status = application.status || "Applied";
          const history = application.statusHistory || [];

          const resumeUrl = application.resumeUrl
            ? `${API_BASE_URL}${application.resumeUrl}`
            : null;

          return (
            <div key={application._id} style={styles.card}>
              <h2>
                {application.student?.name || "Student Application"}
              </h2>

              <p>
                <strong>Email:</strong>{" "}
                {application.student?.email || "Not available"}
              </p>

              <h3>Student Resume</h3>

              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.resumeButton}
                >
                  📄 View / Download Resume
                </a>
              ) : (
                <p style={{ color: "#dc2626" }}>
                  Resume not available for this application.
                </p>
              )}

              <p style={{ marginTop: "20px" }}>
                <strong>Cover Letter:</strong>
              </p>

              <p style={styles.coverLetter}>
                {application.coverLetter || "No cover letter"}
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(
                  application.appliedDate || application.createdAt
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Current Status:</strong>{" "}
                <span
                  style={{
                    color: getStatusColor(status),
                    fontWeight: "bold",
                  }}
                >
                  {status}
                </span>
              </p>

              <h3>Application History</h3>

              {history.length === 0 ? (
                <p>No status history available.</p>
              ) : (
                <div style={styles.history}>
                  {history.map((item, index) => (
                    <p key={index} style={styles.historyItem}>
                      <strong
                        style={{
                          color: getStatusColor(item.status),
                        }}
                      >
                        {item.status}
                      </strong>
                      {" — "}
                      {item.changedAt
                        ? new Date(item.changedAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  ))}
                </div>
              )}

              <h3>Update Application Status</h3>

              <div style={styles.actions}>
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    disabled={
                      updatingId === application._id ||
                      status === option
                    }
                    onClick={() =>
                      updateStatus(application._id, option)
                    }
                    style={{
                      ...styles.button,
                      background: getStatusColor(option),
                      opacity:
                        updatingId === application._id ||
                        status === option
                          ? 0.5
                          : 1,
                    }}
                  >
                    {updatingId === application._id
                      ? "Updating..."
                      : option}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
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
    maxWidth: "900px",
    margin: "0 auto",
  },

  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },

  card: {
    background: "white",
    padding: "25px",
    marginTop: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  resumeButton: {
    display: "inline-block",
    background: "#2563eb",
    color: "white",
    padding: "11px 18px",
    borderRadius: "7px",
    textDecoration: "none",
    fontWeight: "bold",
    marginTop: "5px",
  },

  coverLetter: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "6px",
    whiteSpace: "pre-wrap",
  },

  history: {
    borderLeft: "3px solid #e5e7eb",
    paddingLeft: "15px",
    marginBottom: "20px",
  },

  historyItem: {
    marginBottom: "12px",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },

  button: {
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  empty: {
    background: "white",
    padding: "30px",
    marginTop: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  error: {
    color: "#dc2626",
    background: "#fee2e2",
    padding: "15px",
    borderRadius: "8px",
  },
};

export default CompanyApplications;
