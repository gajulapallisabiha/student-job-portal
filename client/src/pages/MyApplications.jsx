import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/applications/my-applications",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("MY APPLICATIONS:", data);

        if (!response.ok) {
          setError(
            data.message || "Failed to fetch applications"
          );
          setLoading(false);
          return;
        }

        setApplications(data.applications || data || []);
      } catch (error) {
        console.error("APPLICATION ERROR:", error);

        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <h1>My Applications</h1>

          <Link to="/jobs" style={styles.backButton}>
            ← Back to Jobs
          </Link>
        </div>

        {loading && (
          <div style={styles.message}>
            Loading applications...
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          applications.length === 0 && (
            <div style={styles.empty}>
              <h2>No Applications Yet</h2>

              <p>
                You haven't applied for any jobs yet.
              </p>

              <Link to="/jobs">
                <button style={styles.button}>
                  Browse Jobs
                </button>
              </Link>
            </div>
          )}

        {!loading &&
          applications.length > 0 &&
          applications.map((application) => (
            <div
              key={application._id}
              style={styles.card}
            >
              <h2>
                {application.job?.title ||
                  application.jobTitle ||
                  "Job"}
              </h2>

              <p>
                <strong>Company:</strong>{" "}
                {application.job?.company ||
                  application.company ||
                  "Company"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={styles.status}>
                  {application.status || "Pending"}
                </span>
              </p>

              <p>
                <strong>Cover Letter:</strong>
              </p>

              <p>
                {application.coverLetter ||
                  "Not provided"}
              </p>

              {application.createdAt && (
                <p style={styles.date}>
                  Applied on:{" "}
                  {new Date(
                    application.createdAt
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}

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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  backButton: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: "bold",
  },

  card: {
    background: "white",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  status: {
    fontWeight: "bold",
    color: "#2563eb",
  },

  date: {
    color: "#777",
    fontSize: "14px",
  },

  message: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  empty: {
    background: "white",
    padding: "40px",
    textAlign: "center",
    borderRadius: "10px",
  },

  button: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};

export default MyApplications;

