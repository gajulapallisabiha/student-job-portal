
import React, { useEffect, useState } from "react";
import API_URL from "../api";

function CompanyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingInterview, setEditingInterview] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewMode: "Online",
    meetingLink: "",
    location: "",
    instructions: "",
    status: "Scheduled",
  });

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/interviews/company-interviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch interviews");
      }

      setInterviews(data.interviews || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const getInterview = (item) => item.interview || item;

  const getApplicationId = (item) =>
    item.applicationId || item.application?._id;

  const getInterviewId = (item) => getInterview(item)._id;

  const openEditForm = (item) => {
    const interview = getInterview(item);

    setEditingInterview(item);

    setFormData({
      interviewDate: interview.interviewDate
        ? new Date(interview.interviewDate).toISOString().slice(0, 16)
        : "",
      interviewMode: interview.interviewMode || "Online",
      meetingLink: interview.meetingLink || "",
      location: interview.location || "",
      instructions: interview.instructions || "",
      status: interview.status || "Scheduled",
    });

    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const applicationId = getApplicationId(editingInterview);
    const interviewId = getInterviewId(editingInterview);

    if (!applicationId || !interviewId) {
      setMessage("Interview or application ID is missing.");
      return;
    }

    if (!formData.interviewDate) {
      setMessage("Please select an interview date and time.");
      return;
    }

    if (
      formData.interviewMode === "Online" &&
      !formData.meetingLink.trim()
    ) {
      setMessage("Please provide the online meeting link.");
      return;
    }

    if (
      formData.interviewMode === "Offline" &&
      !formData.location.trim()
    ) {
      setMessage("Please provide the interview location.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/interviews/update/${applicationId}/${interviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update interview");
      }

      setMessage("Interview updated successfully!");
      setEditingInterview(null);

      await fetchInterviews();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
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

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const scheduledCount = interviews.filter(
    (item) => getInterview(item).status === "Scheduled"
  ).length;

  const completedCount = interviews.filter(
    (item) => getInterview(item).status === "Completed"
  ).length;

  const cancelledCount = interviews.filter(
    (item) => getInterview(item).status === "Cancelled"
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Interview Management</h1>
            <p style={styles.subtitle}>
              Manage and track your scheduled candidate interviews.
            </p>
          </div>

          <button style={styles.refreshButton} onClick={fetchInterviews}>
            ↻ Refresh
          </button>
        </div>

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Total Interviews</h3>
            <p>{interviews.length}</p>
          </div>

          <div style={styles.statCard}>
            <h3>Scheduled</h3>
            <p style={{ color: "#65b9ed" }}>{scheduledCount}</p>
          </div>

          <div style={styles.statCard}>
            <h3>Completed</h3>
            <p style={{ color: "#65d6a0" }}>{completedCount}</p>
          </div>

          <div style={styles.statCard}>
            <h3>Cancelled</h3>
            <p style={{ color: "#ef8585" }}>{cancelledCount}</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>All Interviews</h2>

          {loading ? (
            <p style={styles.emptyText}>Loading interviews...</p>
          ) : interviews.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3>No Interviews Scheduled Yet</h3>
              <p>
                Interviews scheduled for your applicants will appear here.
              </p>
            </div>
          ) : (
            <div style={styles.interviewGrid}>
              {interviews.map((item, index) => {
                const interview = getInterview(item);
                const student = item.student || {};
                const job = item.job || {};

                return (
                  <div
                    style={styles.interviewCard}
                    key={interview._id || index}
                  >
                    <div style={styles.cardTop}>
                      <div>
                        <h3 style={styles.studentName}>
                          {student.name || "Student"}
                        </h3>
                        <p style={styles.email}>
                          {student.email || "Email unavailable"}
                        </p>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          color: getStatusColor(interview.status),
                          borderColor: getStatusColor(interview.status),
                        }}
                      >
                        {interview.status}
                      </span>
                    </div>

                    <div style={styles.details}>
                      <p>
                        <strong>Job:</strong>{" "}
                        {job.title || "Job details unavailable"}
                      </p>

                      <p>
                        <strong>Company:</strong>{" "}
                        {job.company || "Company"}
                      </p>

                      <p>
                        <strong>Date & Time:</strong>{" "}
                        {formatDate(interview.interviewDate)}
                      </p>

                      <p>
                        <strong>Mode:</strong>{" "}
                        {interview.interviewMode}
                      </p>

                      {interview.interviewMode === "Online" &&
                        interview.meetingLink && (
                          <p>
                            <strong>Meeting Link:</strong>{" "}
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.link}
                            >
                              Join Meeting
                            </a>
                          </p>
                        )}

                      {interview.interviewMode === "Offline" &&
                        interview.location && (
                          <p>
                            <strong>Location:</strong>{" "}
                            {interview.location}
                          </p>
                        )}

                      {interview.instructions && (
                        <p>
                          <strong>Instructions:</strong>{" "}
                          {interview.instructions}
                        </p>
                      )}
                    </div>

                    {interview.status !== "Cancelled" &&
                      interview.status !== "Completed" && (
                        <button
                          style={styles.editButton}
                          onClick={() => openEditForm(item)}
                        >
                          Manage Interview
                        </button>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {editingInterview && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h2>Update Interview</h2>

                <button
                  style={styles.closeButton}
                  onClick={() => setEditingInterview(null)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdate}>
                <label style={styles.label}>Interview Date & Time</label>
                <input
                  type="datetime-local"
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <label style={styles.label}>Interview Mode</label>
                <select
                  name="interviewMode"
                  value={formData.interviewMode}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>

                {formData.interviewMode === "Online" ? (
                  <>
                    <label style={styles.label}>Meeting Link</label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      placeholder="https://meet.google.com/..."
                      style={styles.input}
                      required
                    />
                  </>
                ) : (
                  <>
                    <label style={styles.label}>Interview Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter interview venue"
                      style={styles.input}
                      required
                    />
                  </>
                )}

                <label style={styles.label}>Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Enter interview instructions"
                  rows="3"
                  style={styles.input}
                />

                <label style={styles.label}>Interview Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <div style={styles.modalActions}>
                  <button
                    type="button"
                    style={styles.cancelButton}
                    onClick={() => setEditingInterview(null)}
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    style={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "30px",
  },
  heading: {
    fontSize: "30px",
    margin: "0 0 8px",
    color: "#fff5fa",
  },
  subtitle: {
    color: "#c8b9c4",
    margin: 0,
  },
  refreshButton: {
    padding: "11px 20px",
    background: "#443441",
    border: "1px solid #74546a",
    color: "#fff5fa",
    borderRadius: "9px",
    cursor: "pointer",
  },
  message: {
    padding: "12px 16px",
    background: "#3c303a",
    border: "1px solid #80536d",
    borderRadius: "8px",
    marginBottom: "20px",
    color: "#f5a2c5",
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
  interviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  interviewCard: {
    background: "#322b35",
    border: "1px solid #493b48",
    borderRadius: "14px",
    padding: "22px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "20px",
  },
  studentName: {
    margin: "0 0 6px",
    fontSize: "19px",
  },
  email: {
    margin: 0,
    color: "#c8b9c4",
    fontSize: "13px",
    wordBreak: "break-word",
  },
  statusBadge: {
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
  },
  editButton: {
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    background: "#e85a9b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  emptyCard: {
    background: "#322b35",
    border: "1px solid #493b48",
    borderRadius: "12px",
    padding: "35px",
    textAlign: "center",
    color: "#c8b9c4",
  },
  emptyText: {
    color: "#c8b9c4",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
    overflowY: "auto",
  },
  modal: {
    width: "100%",
    maxWidth: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#322b35",
    border: "1px solid #60485a",
    borderRadius: "15px",
    padding: "25px",
    color: "#fff5fa",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "#fff5fa",
    fontSize: "28px",
    cursor: "pointer",
  },
  label: {
    display: "block",
    margin: "14px 0 7px",
    color: "#f5a2c5",
    fontWeight: "600",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    background: "#252329",
    border: "1px solid #65505f",
    borderRadius: "8px",
    color: "#fff5fa",
    fontSize: "14px",
    outline: "none",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "22px",
  },
  cancelButton: {
    padding: "11px 18px",
    background: "#51434f",
    border: "none",
    color: "#fff5fa",
    borderRadius: "8px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "11px 18px",
    background: "#e85a9b",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default CompanyInterviews;
