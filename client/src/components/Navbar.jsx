
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role?.toUpperCase();

  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!token || role !== "STUDENT") return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          console.error("Could not fetch notifications:", result);
          return;
        }

        const applications = Array.isArray(result)
          ? result
          : result.applications ||
            result.data?.applications ||
            result.data ||
            [];

        const updates = applications.flatMap((application) =>
          (application.statusHistory || [])
            .filter((item) => item.status !== "Applied")
            .map((item, index) => ({
              id: `${application._id}-${index}`,
              status: item.status,
              jobTitle: application.job?.title || "Job Application",
              date: item.changedAt,
            }))
        );

        setNotifications(
          updates.sort(
            (a, b) =>
              new Date(b.date || 0) - new Date(a.date || 0)
          )
        );
      } catch (error) {
        console.error("Notification error:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [token, role]);

  const unreadCount = notifications.filter(
    (item) => !readIds.includes(item.id)
  ).length;

  const handleBellClick = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    if (nextState) {
      const allIds = notifications.map((item) => item.id);
      const updatedReadIds = [...new Set([...readIds, ...allIds])];

      setReadIds(updatedReadIds);
      localStorage.setItem(
        "readNotifications",
        JSON.stringify(updatedReadIds)
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("readNotifications");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/jobs" className="navbar-logo">
        JobPortal
      </Link>

      <div className="navbar-links">
        {token && role === "STUDENT" && (
          <>
            <Link to="/jobs">Jobs</Link>
            <Link to="/my-applications">My Applications</Link>
          </>
        )}

        {token && role === "COMPANY" && (
          <>
            <Link to="/company-dashboard">Dashboard</Link>
            <Link to="/post-job">Post Job</Link>
            <Link to="/company-jobs">My Posted Jobs</Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {token && role === "STUDENT" && (
          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={handleBellClick}
              aria-label="Notifications"
            >
              🔔

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <h3>Notifications</h3>

                {notifications.length === 0 ? (
                  <p>No notifications yet.</p>
                ) : (
                  notifications.slice(0, 10).map((item) => {
                    const isRead = readIds.includes(item.id);

                    return (
                      <div
                        className={`notification-item ${
                          isRead ? "read" : "unread"
                        }`}
                        key={item.id}
                      >
                        <strong>{item.status}</strong>
                        <p>{item.jobTitle}</p>

                        <small>
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : ""}
                        </small>

                        <span className="read-label">
                          {isRead ? "Read" : "Unread"}
                        </span>
                      </div>
                    );
                  })
                )}

                <Link
                  to="/my-applications"
                  onClick={() => setShowNotifications(false)}
                >
                  View All Applications
                </Link>
              </div>
            )}
          </div>
        )}

        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
