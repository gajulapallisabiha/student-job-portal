
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
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
          throw new Error(data.message || "Failed to load dashboard");
        }

        setApplications(
          Array.isArray(data)
            ? data
            : data.applications || data.data || []
        );
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const getStatus = (status) => {
    return status || "Applied";
  };

  const total = applications.length;

  const applied = applications.filter(
    (app) => getStatus(app.status) === "Applied"
  ).length;

  const underReview = applications.filter(
    (app) => getStatus(app.status) === "Under Review"
  ).length;

  const shortlisted = applications.filter(
    (app) => getStatus(app.status) === "Shortlisted"
  ).length;

  const selected = applications.filter(
    (app) => getStatus(app.status) === "Selected"
  ).length;

  const rejected = applications.filter(
    (app) => getStatus(app.status) === "Rejected"
  ).length;

  const successRate =
    total > 0 ? Math.round((selected / total) * 100) : 0;

  const statusData = [
    { label: "Applied", count: applied, color: "#e89bca" },
    { label: "Under Review", count: underReview, color: "#e6b86b" },
    { label: "Shortlisted", count: shortlisted, color: "#83b9ed" },
    { label: "Selected", count: selected, color: "#65d6a0" },
    { label: "Rejected", count: rejected, color: "#ed8585" },
  ];

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.appliedDate || b.createdAt || 0) -
        new Date(a.appliedDate || a.createdAt || 0)
    )
    .slice(0, 5);

  const recentActivity = applications
    .flatMap((app) =>
      (app.statusHistory || [])
        .filter((item) => item.status !== "Applied")
        .map((item) => ({
          ...item,
          jobTitle: app.job?.title || "Job Application",
          changedAt: item.changedAt,
        }))
    )
    .sort(
      (a, b) =>
        new Date(b.changedAt || 0) - new Date(a.changedAt || 0)
    )
    .slice(0, 5);

  const getStatusColor = (status) => {
    const colors = {
      Applied: "#e89bca",
      "Under Review": "#e6b86b",
      Shortlisted: "#83b9ed",
      Selected: "#65d6a0",
      Rejected: "#ed8585",
    };

    return colors[status] || "#e89bca";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={styles.message}>
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.message}>
        <p>{error}</p>
        <button
          style={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>STUDENT OVERVIEW</p>
            <h1 style={styles.heading}>My Dashboard</h1>
            <p style={styles.subtitle}>
              Track your applications and monitor your job search progress.
            </p>
          </div>

          <Link to="/jobs" style={styles.primaryButton}>
            Explore Jobs
          </Link>
        </div>

        {/* STATISTICS CARDS */}
        <div style={styles.statsGrid}>
          <StatCard
            title="Total Applications"
            value={total}
            color="#e89bca"
            icon="📄"
          />

          <StatCard
            title="Under Review"
            value={underReview}
            color="#e6b86b"
            icon="⏳"
          />

          <StatCard
            title="Shortlisted"
            value={shortlisted}
            color="#83b9ed"
            icon="⭐"
          />

          <StatCard
            title="Selected"
            value={selected}
            color="#65d6a0"
            icon="✓"
          />
        </div>

        {/* ANALYTICS */}
        <div style={styles.analyticsGrid}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Application Analytics</h2>
            <p style={styles.sectionSubtitle}>
              Overview of your application statuses
            </p>

            {statusData.map((item) => {
              const percentage =
                total > 0 ? (item.count / total) * 100 : 0;

              return (
                <div key={item.label} style={styles.barItem}>
                  <div style={styles.barHeader}>
                    <span style={styles.barLabel}>{item.label}</span>
                    <span style={styles.barCount}>{item.count}</span>
                  </div>

                  <div style={styles.barBackground}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${percentage}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          {/* SUCCESS RATE */}
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Selection Success Rate</h2>
            <p style={styles.sectionSubtitle}>
              Percentage of applications resulting in selection
            </p>

            <div style={styles.successContent}>
              <div
                style={{
                  ...styles.successCircle,
                  background: `conic-gradient(#65d6a0 0% ${successRate}%, #51404d ${successRate}% 100%)`,
                }}
              >
                <div style={styles.successInner}>
                  <span style={styles.successNumber}>
                    {successRate}%
                  </span>
                  <span style={styles.successLabel}>Success</span>
                </div>
              </div>

              <div style={styles.successInfo}>
                <p>
                  <strong>{selected}</strong> selected
                </p>
                <p>
                  <strong>{total}</strong> total applications
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* RECENT APPLICATIONS */}
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Recent Applications</h2>
              <p style={styles.sectionSubtitle}>
                Your latest job applications
              </p>
            </div>

            <Link to="/my-applications" style={styles.viewLink}>
              View All →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div style={styles.emptyState}>
              <p>You haven't applied for any jobs yet.</p>
              <Link to="/jobs" style={styles.viewLink}>
                Browse available jobs →
              </Link>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeading}>Job Title</th>
                    <th style={styles.tableHeading}>Company</th>
                    <th style={styles.tableHeading}>Applied Date</th>
                    <th style={styles.tableHeading}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td style={styles.tableCell}>
                        {app.job?.title || "Job unavailable"}
                      </td>

                      <td style={styles.tableCell}>
                        {app.job?.company || "N/A"}
                      </td>

                      <td style={styles.tableCell}>
                        {formatDate(
                          app.appliedDate || app.createdAt
                        )}
                      </td>

                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            color: getStatusColor(app.status),
                            background: `${getStatusColor(app.status)}20`,
                          }}
                        >
                          {getStatus(app.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RECENT ACTIVITY */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Recent Status Activity</h2>
          <p style={styles.sectionSubtitle}>
            Latest updates from your applications
          </p>

          {recentActivity.length === 0 ? (
            <div style={styles.emptyState}>
              No new application status updates yet.
            </div>
          ) : (
            <div style={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <div key={`${activity.jobTitle}-${index}`} style={styles.activityItem}>
                  <div
                    style={{
                      ...styles.activityDot,
                      background: getStatusColor(activity.status),
                    }}
                  />

                  <div style={styles.activityDetails}>
                    <strong style={styles.activityTitle}>
                      {activity.jobTitle}
                    </strong>

                    <p style={styles.activityText}>
                      Status updated to{" "}
                      <span
                        style={{
                          color: getStatusColor(activity.status),
                          fontWeight: "700",
                        }}
                      >
                        {activity.status}
                      </span>
                    </p>

                    <span style={styles.activityDate}>
                      {formatDate(activity.changedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* QUICK ACTIONS */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <p style={styles.sectionSubtitle}>
            Manage your job search from here
          </p>

          <div style={styles.actionsGrid}>
            <QuickAction
              title="Find Jobs"
              description="Explore new opportunities"
              link="/jobs"
              icon="🔍"
            />

            <QuickAction
              title="My Applications"
              description="Track your applications"
              link="/my-applications"
              icon="📋"
            />

            <QuickAction
              title="Saved Jobs"
              description="View your bookmarked jobs"
              link="/saved-jobs"
              icon="❤️"
            />

            <QuickAction
              title="My Profile"
              description="Update your profile and resume"
              link="/profile"
              icon="👤"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <span style={styles.statTitle}>{title}</span>
        <span style={styles.statIcon}>{icon}</span>
      </div>

      <h2 style={{ ...styles.statValue, color }}>{value}</h2>
    </div>
  );
}

function QuickAction({ title, description, link, icon }) {
  return (
    <Link to={link} style={styles.actionCard}>
      <span style={styles.actionIcon}>{icon}</span>

      <div>
        <h3 style={styles.actionTitle}>{title}</h3>
        <p style={styles.actionDescription}>{description}</p>
      </div>

      <span style={styles.actionArrow}>→</span>
    </Link>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#252329",
    color: "#fff5fa",
    padding: "35px 20px 60px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1200px",
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
    color: "#e89bca",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  heading: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px",
  },

  subtitle: {
    color: "#c9bdc7",
    fontSize: "14px",
    margin: 0,
  },

  primaryButton: {
    background: "#e85a9b",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 22px",
    borderRadius: "9px",
    fontWeight: "700",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#322b35",
    border: "1px solid #51404d",
    borderRadius: "14px",
    padding: "22px",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statTitle: {
    color: "#d3c6d0",
    fontSize: "14px",
  },

  statIcon: {
    fontSize: "22px",
  },

  statValue: {
    fontSize: "32px",
    margin: "18px 0 0",
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "22px",
  },

  card: {
    background: "#322b35",
    border: "1px solid #51404d",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "22px",
    minWidth: 0,
  },

  sectionTitle: {
    fontSize: "19px",
    fontWeight: "750",
    margin: "0 0 7px",
  },

  sectionSubtitle: {
    color: "#bcaeba",
    fontSize: "13px",
    margin: "0 0 22px",
  },

  barItem: {
    marginBottom: "18px",
  },

  barHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  barLabel: {
    color: "#eee2eb",
    fontSize: "13px",
  },

  barCount: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "13px",
  },

  barBackground: {
    height: "9px",
    background: "#51404d",
    borderRadius: "20px",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: "20px",
    transition: "width 0.4s ease",
  },

  successContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "25px",
    padding: "10px 0",
  },

  successCircle: {
    width: "145px",
    height: "145px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  successInner: {
    width: "115px",
    height: "115px",
    borderRadius: "50%",
    background: "#322b35",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  successNumber: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#65d6a0",
  },

  successLabel: {
    color: "#c9bdc7",
    fontSize: "12px",
  },

  successInfo: {
    color: "#e9dce6",
    fontSize: "14px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },

  viewLink: {
    color: "#f08cbb",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
    textAlign: "left",
  },

  tableHeading: {
    color: "#c9bdc7",
    fontSize: "12px",
    padding: "14px 12px",
    borderBottom: "1px solid #51404d",
  },

  tableCell: {
    color: "#f5eaf2",
    fontSize: "13px",
    padding: "16px 12px",
    borderBottom: "1px solid #51404d",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  emptyState: {
    textAlign: "center",
    padding: "25px 10px",
    color: "#c9bdc7",
    fontSize: "14px",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
  },

  activityItem: {
    display: "flex",
    gap: "14px",
    padding: "15px 0",
    borderBottom: "1px solid #51404d",
  },

  activityDot: {
    width: "11px",
    height: "11px",
    borderRadius: "50%",
    marginTop: "5px",
    flexShrink: 0,
  },

  activityDetails: {
    flex: 1,
  },

  activityTitle: {
    fontSize: "14px",
    color: "#fff5fa",
  },

  activityText: {
    fontSize: "13px",
    color: "#c9bdc7",
    margin: "6px 0",
  },

  activityDate: {
    color: "#a99aa7",
    fontSize: "11px",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "17px",
    borderRadius: "11px",
    border: "1px solid #51404d",
    background: "#39313d",
    textDecoration: "none",
    color: "#fff5fa",
  },

  actionIcon: {
    fontSize: "23px",
  },

  actionTitle: {
    fontSize: "14px",
    margin: "0 0 5px",
  },

  actionDescription: {
    fontSize: "11px",
    color: "#c9bdc7",
    margin: 0,
  },

  actionArrow: {
    marginLeft: "auto",
    color: "#f08cbb",
    fontSize: "20px",
  },

  message: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#252329",
    color: "#fff5fa",
    fontSize: "16px",
  },

  retryButton: {
    background: "#e85a9b",
    border: "none",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
};

export default StudentDashboard;
