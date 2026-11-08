
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
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch applications");
          return;
        }

        setApplications(data.applications || []);
      } catch (err) {
        console.error("APPLICATION ERROR:", err);
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  // Collect all application status updates
  const notifications = applications
    .flatMap((application) =>
      (application.statusHistory || [])
        .filter((item) => item.status !== "Applied")
        .map((item, index) => ({
          ...item,
          id: `${application._id}-${index}`,
          jobTitle: application.job?.title || "Job",
          company: application.job?.company || "Company",
        }))
    )
    .sort(
      (a, b) =>
        new Date(b.changedAt || 0) -
        new Date(a.changedAt || 0)
    );

  const getTimeline = (application) => {
    if (
      application.statusHistory &&
      application.statusHistory.length > 0
    ) {
      return application.statusHistory;
    }

    return [
      {
        status: "Applied",
        changedAt:
          application.appliedDate || application.createdAt,
      },
      ...(application.status &&
      application.status !== "Applied"
        ? [
            {
              status: application.status,
              changedAt: null,
            },
          ]
        : []),
    ];
  };

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

        {!loading && !error && (
          <>
            {/* APPLICATION NOTIFICATIONS */}

            <div style={styles.notificationBox}>
              <h2>🔔 Application Notifications</h2>

              <p style={styles.notificationSubtitle}>
                Updates from companies about your applications.
              </p>

              {notifications.length === 0 ? (
                <p style={styles.noNotification}>
                  No new application updates yet.
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={styles.notification}
                  >
                    <div>
                      <strong
                        style={{
                          color: getStatusColor(
                            notification.status
                          ),
                        }}
                      >
                        {notification.status === "Selected"
                          ? "Congratulations! You have been selected!"
                          : notification.status === "Rejected"
                          ? "Your application was rejected."
                          : notification.status === "Shortlisted"
                          ? "Your application has been shortlisted!"
                          : "Your application is under review."}
                      </strong>

                      <p style={styles.notificationText}>
                        {notification.company} -{" "}
                        {notification.jobTitle}
                      </p>

                      <small style={styles.notificationDate}>
                        {notification.changedAt
                          ? new Date(
                              notification.changedAt
                            ).toLocaleString()
                          : "Date not available"}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* APPLICATION LIST */}

            {applications.length === 0 ? (
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
            ) : (
              applications.map((application) => {
                const timeline = getTimeline(application);
                const currentStatus =
                  application.status || "Applied";

                return (
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
                      <strong>Location:</strong>{" "}
                      {application.job?.location ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>Job Type:</strong>{" "}
                      {application.job?.type ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>Current Status:</strong>{" "}
                      <span
                        style={{
                          ...styles.status,
                          color: getStatusColor(currentStatus),
                        }}
                      >
                        {currentStatus}
                      </span>
                    </p>

                    <p style={styles.sectionTitle}>
                      Application Progress
                    </p>

                    <div style={styles.timeline}>
                      {timeline.map((item, index) => (
                        <div
                          key={`${item.status}-${index}`}
                          style={styles.timelineItem}
                        >
                          <div
                            style={{
                              ...styles.timelineDot,
                              background: getStatusColor(
                                item.status
                              ),
                            }}
                          />

                          <div>
                            <strong
                              style={{
                                color: getStatusColor(
                                  item.status
                                ),
                              }}
                            >
                              {item.status}
                            </strong>

                            <p style={styles.timelineDate}>
                              {item.changedAt
                                ? new Date(
                                    item.changedAt
                                  ).toLocaleString()
                                : "Date not available"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p style={styles.sectionTitle}>
                      Cover Letter
                    </p>

                    <p style={styles.coverLetter}>
                      {application.coverLetter ||
                        "Not provided"}
                    </p>

                    <p style={styles.date}>
                      Applied on:{" "}
                      {new Date(
                        application.appliedDate ||
                          application.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            )}
          </>
        )}
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
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
  },

  backButton: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: "bold",
  },

  notificationBox: {
    background: "white",
    padding: "25px",
    marginBottom: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  notificationSubtitle: {
    color: "#777",
    fontSize: "14px",
  },

  notification: {
    background: "#f8fafc",
    borderLeft: "4px solid #2563eb",
    padding: "15px",
    marginTop: "12px",
    borderRadius: "6px",
  },

  notificationText: {
    margin: "8px 0",
  },

  notificationDate: {
    color: "#777",
  },

  noNotification: {
    color: "#777",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "6px",
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
  },

  sectionTitle: {
    fontWeight: "bold",
    marginTop: "22px",
    marginBottom: "12px",
  },

  timeline: {
    borderLeft: "3px solid #e5e7eb",
    marginLeft: "7px",
    paddingLeft: "20px",
  },

  timelineItem: {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "20px",
  },

  timelineDot: {
    position: "absolute",
    left: "-28px",
    top: "4px",
    width: "13px",
    height: "13px",
    borderRadius: "50%",
  },

  timelineDate: {
    color: "#777",
    fontSize: "13px",
    marginTop: "5px",
  },

  coverLetter: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "6px",
    whiteSpace: "pre-wrap",
  },

  date: {
    color: "#777",
    fontSize: "14px",
    marginTop: "20px",
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
