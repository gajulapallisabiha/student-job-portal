
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

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
          `${API_URL}/applications/my-applications`,
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
        return "#55d69e";
      case "Rejected":
        return "#ff737e";
      case "Shortlisted":
        return "#c29aff";
      case "Under Review":
        return "#ffc36b";
      default:
        return "#f5a2c5";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Selected":
        return "Congratulations! You have been selected!";
      case "Rejected":
        return "Your application was rejected.";
      case "Shortlisted":
        return "Your application has been shortlisted!";
      case "Under Review":
        return "Your application is under review.";
      default:
        return "Your application has been submitted.";
    }
  };

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
        changedAt: application.appliedDate || application.createdAt,
      },
      ...(application.status && application.status !== "Applied"
        ? [
            {
              status: application.status,
              changedAt: null,
            },
          ]
        : []),
    ];
  };

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

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleString();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>STUDENT DASHBOARD</p>
            <h1 style={styles.heading}>My Applications</h1>
            <p style={styles.subtitle}>
              Track your job applications and stay updated on your progress.
            </p>
          </div>

          <Link to="/jobs" style={styles.backButton}>
            ← Back to Jobs
          </Link>
        </div>

        {loading && (
          <div style={styles.message}>
            Loading your applications...
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* APPLICATION SUMMARY */}

            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <span style={styles.summaryLabel}>Total Applications</span>
                <strong style={styles.summaryNumber}>
                  {applications.length}
                </strong>
              </div>

              <div style={styles.summaryCard}>
                <span style={styles.summaryLabel}>Under Review</span>
                <strong style={styles.summaryNumber}>
                  {applications.filter(
                    (app) => app.status === "Under Review"
                  ).length}
                </strong>
              </div>

              <div style={styles.summaryCard}>
                <span style={styles.summaryLabel}>Shortlisted</span>
                <strong style={styles.summaryNumber}>
                  {applications.filter(
                    (app) => app.status === "Shortlisted"
                  ).length}
                </strong>
              </div>

              <div style={styles.summaryCard}>
                <span style={styles.summaryLabel}>Selected</span>
                <strong style={styles.summaryNumber}>
                  {applications.filter(
                    (app) => app.status === "Selected"
                  ).length}
                </strong>
              </div>
            </div>

            {/* APPLICATION NOTIFICATIONS */}

            <div style={styles.notificationBox}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionHeading}>
                    Application Notifications
                  </h2>
                  <p style={styles.subtitle}>
                    Recent updates from companies.
                  </p>
                </div>

                <span style={styles.notificationCount}>
                  {notifications.length} Updates
                </span>
              </div>

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
                    <div
                      style={{
                        ...styles.notificationDot,
                        background: getStatusColor(notification.status),
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <strong
                        style={{
                          color: getStatusColor(notification.status),
                        }}
                      >
                        {getStatusMessage(notification.status)}
                      </strong>

                      <p style={styles.notificationText}>
                        {notification.company} · {notification.jobTitle}
                      </p>

                      <small style={styles.mutedText}>
                        {formatDate(notification.changedAt)}
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
                <p style={styles.subtitle}>
                  You haven't applied for any jobs yet.
                </p>

                <Link to="/jobs" style={styles.primaryButton}>
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div>
                <h2 style={styles.listHeading}>
                  Your Submitted Applications
                </h2>

                {applications.map((application) => {
                  const timeline = getTimeline(application);
                  const currentStatus = application.status || "Applied";

                  return (
                    <div
                      key={application._id}
                      style={styles.card}
                    >
                      <div style={styles.cardHeader}>
                        <div>
                          <h2 style={styles.jobTitle}>
                            {application.job?.title ||
                              application.jobTitle ||
                              "Job"}
                          </h2>

                          <p style={styles.companyName}>
                            {application.job?.company ||
                              application.company ||
                              "Company"}
                          </p>
                        </div>

                        <span
                          style={{
                            ...styles.statusBadge,
                            color: getStatusColor(currentStatus),
                            borderColor: getStatusColor(currentStatus),
                          }}
                        >
                          {currentStatus}
                        </span>
                      </div>

                      <div style={styles.detailsGrid}>
                        <div>
                          <span style={styles.detailLabel}>Location</span>
                          <p style={styles.detailValue}>
                            {application.job?.location || "Not specified"}
                          </p>
                        </div>

                        <div>
                          <span style={styles.detailLabel}>Job Type</span>
                          <p style={styles.detailValue}>
                            {application.job?.type || "Not specified"}
                          </p>
                        </div>

                        <div>
                          <span style={styles.detailLabel}>Applied On</span>
                          <p style={styles.detailValue}>
                            {new Date(
                              application.appliedDate ||
                                application.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div style={styles.divider} />

                      {/* APPLICATION TIMELINE */}

                      <h3 style={styles.sectionTitle}>
                        Application Progress
                      </h3>

                      <div style={styles.timeline}>
                        {timeline.map((item, index) => (
                          <div
                            key={`${item.status}-${index}`}
                            style={styles.timelineItem}
                          >
                            <div
                              style={{
                                ...styles.timelineDot,
                                background: getStatusColor(item.status),
                                boxShadow: `0 0 12px ${getStatusColor(item.status)}55`,
                              }}
                            />

                            <div>
                              <strong
                                style={{
                                  color: getStatusColor(item.status),
                                }}
                              >
                                {item.status}
                              </strong>

                              <p style={styles.timelineDate}>
                                {formatDate(item.changedAt)}
                              </p>

                              {item.changedBy?.name && (
                                <p style={styles.updatedBy}>
                                  Updated by {item.changedBy.name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={styles.divider} />

                      <h3 style={styles.sectionTitle}>Cover Letter</h3>

                      <p style={styles.coverLetter}>
                        {application.coverLetter || "Not provided"}
                      </p>
                    </div>
                  );
                })}
              </div>
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
    background: "#252329",
    padding: "40px 20px",
    color: "#fff5fa",
  },

  container: {
    maxWidth: "1050px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
  },

  eyebrow: {
    color: "#e85a9b",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  heading: {
    fontSize: "32px",
    margin: "0 0 8px",
    color: "#fff5fa",
  },

  subtitle: {
    color: "#cbb9c5",
    fontSize: "14px",
    margin: "6px 0",
  },

  backButton: {
    color: "#f5a2c5",
    textDecoration: "none",
    fontWeight: "700",
    border: "1px solid #71415a",
    padding: "11px 17px",
    borderRadius: "9px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  summaryCard: {
    background: "#322b35",
    border: "1px solid #51404d",
    borderRadius: "12px",
    padding: "20px",
  },

  summaryLabel: {
    display: "block",
    color: "#cbb9c5",
    fontSize: "13px",
    marginBottom: "12px",
  },

  summaryNumber: {
    fontSize: "29px",
    color: "#f5a2c5",
  },

  notificationBox: {
    background: "#322b35",
    border: "1px solid #51404d",
    padding: "24px",
    marginBottom: "30px",
    borderRadius: "13px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "15px",
  },

  sectionHeading: {
    color: "#fff5fa",
    fontSize: "20px",
    margin: "0 0 6px",
  },

  notificationCount: {
    color: "#f5a2c5",
    background: "#493142",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  notification: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    background: "#29232d",
    border: "1px solid #51404d",
    padding: "16px",
    marginTop: "12px",
    borderRadius: "9px",
  },

  notificationDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginTop: "5px",
    flexShrink: 0,
  },

  notificationText: {
    color: "#e8d8e1",
    margin: "7px 0",
    fontSize: "14px",
  },

  mutedText: {
    color: "#bdaab6",
    fontSize: "12px",
  },

  noNotification: {
    color: "#cbb9c5",
    padding: "15px",
    background: "#29232d",
    borderRadius: "8px",
  },

  listHeading: {
    fontSize: "22px",
    margin: "30px 0 18px",
    color: "#fff5fa",
  },

  card: {
    background: "#322b35",
    border: "1px solid #51404d",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "13px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.12)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "15px",
  },

  jobTitle: {
    fontSize: "21px",
    color: "#fff5fa",
    margin: "0 0 7px",
  },

  companyName: {
    color: "#f5a2c5",
    fontSize: "14px",
    margin: 0,
  },

  statusBadge: {
    border: "1px solid",
    borderRadius: "20px",
    padding: "7px 13px",
    fontSize: "12px",
    fontWeight: "800",
    background: "#29232d",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "18px",
    marginTop: "24px",
  },

  detailLabel: {
    color: "#bdaab6",
    fontSize: "12px",
  },

  detailValue: {
    color: "#fff5fa",
    fontSize: "14px",
    margin: "6px 0 0",
  },

  divider: {
    height: "1px",
    background: "#554451",
    margin: "22px 0",
  },

  sectionTitle: {
    fontWeight: "800",
    fontSize: "16px",
    color: "#fff5fa",
    marginBottom: "18px",
  },

  timeline: {
    borderLeft: "2px solid #76536a",
    marginLeft: "7px",
    paddingLeft: "23px",
  },

  timelineItem: {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "24px",
    minHeight: "35px",
  },

  timelineDot: {
    position: "absolute",
    left: "-30px",
    top: "4px",
    width: "13px",
    height: "13px",
    borderRadius: "50%",
    border: "2px solid #322b35",
  },

  timelineDate: {
    color: "#cbb9c5",
    fontSize: "12px",
    marginTop: "6px",
  },

  updatedBy: {
    color: "#bdaab6",
    fontSize: "12px",
    marginTop: "4px",
  },

  coverLetter: {
    background: "#29232d",
    border: "1px solid #51404d",
    color: "#e8d8e1",
    padding: "15px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
  },

  message: {
    background: "#322b35",
    padding: "25px",
    borderRadius: "10px",
  },

  error: {
    background: "#492b35",
    color: "#ffb3bd",
    padding: "15px",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  empty: {
    background: "#322b35",
    border: "1px solid #51404d",
    padding: "40px",
    textAlign: "center",
    borderRadius: "12px",
  },

  primaryButton: {
    display: "inline-block",
    marginTop: "15px",
    padding: "12px 22px",
    borderRadius: "8px",
    background: "#e85a9b",
    color: "white",
    textDecoration: "none",
    fontWeight: "700",
  },
};

export default MyApplications;
