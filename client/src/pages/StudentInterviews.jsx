
import React, { useEffect, useState } from "react";
import API_URL from "../api";

function StudentInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch(
          `${API_URL}/interviews/my-interviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load interviews");
        }

        setInterviews(data.interviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "#65b9ed";
      case "Completed":
        return "#65d6a0";
      case "Cancelled":
        return "#ef8585";
      default:
        return "#cccccc";
    }
  };

  const scheduled = interviews.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const completed = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelled = interviews.filter(
    (item) => item.status === "Cancelled"
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.heading}>My Interviews</h1>
          <p style={styles.subtitle}>
            View your upcoming and previous job interviews.
          </p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Total Interviews</h3>
            <p>{interviews.length}</p>
          </div>

          <div style={styles.statCard}>
            <h3>Upcoming</h3>
            <p style={{ color: "#65b9ed" }}>{scheduled}</p>
          </div>

          <div style={styles.statCard}>
            <h3>Completed</h3>
            <p style={{ color: "#65d6a0" }}>{completed}</p>
          </div>

          <div style={styles.statCard}>
            <h3>Cancelled</h3>
            <p style={{ color: "#ef8585" }}>{cancelled}</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Interview Schedule</h2>

          {loading ? (
            <p style={styles.message}>Loading your interviews...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : interviews.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3>No Interviews Yet</h3>
              <p>
                When a company schedules an interview for your application,
                the details will appear here.
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {interviews.map((interview, index) => (
                <div
                  key={interview._id || index}
                  style={styles.card}
                >
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.jobTitle}>
                        {interview.job?.title || "Job Interview"}
                      </h3>

                      <p style={styles.company}>
                        {interview.job?.company || "Company"}
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.badge,
                        color: getStatusColor(interview.status),
                        borderColor: getStatusColor(interview.status),
                      }}
                    >
                      {interview.status}
                    </span>
                  </div>

                  <div style={styles.details}>
                    <p>
                      <strong>Date & Time:</strong>
                      <br />
                      {formatDate(interview.interviewDate)}
                    </p>

                    <p>
                      <strong>Interview Mode:</strong>
                      <br />
                      {interview.interviewMode}
                    </p>

                    {interview.interviewMode === "Online" &&
                      interview.meetingLink && (
                        <p>
                          <strong>Meeting Link:</strong>
                          <br />
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.link}
                          >
                            Join Interview
                          </a>
                        </p>
                      )}

                    {interview.interviewMode === "Offline" &&
                      interview.location && (
                        <p>
                          <strong>Interview Location:</strong>
                          <br />
                          {interview.location}
                        </p>
                      )}

                    {interview.instructions && (
                      <p>
                        <strong>Instructions:</strong>
                        <br />
                        {interview.instructions}
                      </p>
                    )}

                    {interview.scheduledBy && (
                      <p>
                        <strong>Scheduled By:</strong>
                        <br />
                        {interview.scheduledBy.name || "Company"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#252329",
    color: "#fff5fa",
    padding: "40px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "auto",
  },
  header: {
    marginBottom: "30px",
  },
  heading: {
    fontSize: "30px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#c8b9c4",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
    marginBottom: "40px",
  },
  statCard: {
    background: "#322b35",
    padding: "22px",
    borderRadius: "13px",
    border: "1px solid #493b48",
  },
  section: {
    marginTop: "20px",
  },
  sectionHeading: {
    fontSize: "23px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#322b35",
    border: "1px solid #493b48",
    borderRadius: "14px",
    padding: "22px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "20px",
  },
  jobTitle: {
    margin: "0 0 6px",
    fontSize: "19px",
  },
  company: {
    margin: 0,
    color: "#f5a2c5",
  },
  badge: {
    border: "1px solid",
    borderRadius: "20px",
    padding: "5px 10px",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  details: {
    color: "#e5dce3",
    fontSize: "14px",
    lineHeight: "1.7",
    overflowWrap: "anywhere",
  },
  link: {
    color: "#f5a2c5",
    textDecoration: "none",
    fontWeight: "600",
  },
  emptyCard: {
    background: "#322b35",
    border: "1px solid #493b48",
    borderRadius: "12px",
    padding: "35px",
    textAlign: "center",
    color: "#c8b9c4",
  },
  message: {
    color: "#c8b9c4",
  },
  error: {
    color: "#ef8585",
  },
};

export default StudentInterviews;
