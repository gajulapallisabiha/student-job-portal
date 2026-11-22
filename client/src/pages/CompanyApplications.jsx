
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL, { API_BASE_URL } from "../api";
import "./CompanyApplications.css";

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

  const [scheduleFor, setScheduleFor] = useState(null);
  const [scheduleLoadingId, setScheduleLoadingId] = useState(null);
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [scheduleError, setScheduleError] = useState("");

  const [interviewData, setInterviewData] = useState({
    interviewDate: "",
    interviewMode: "Online",
    meetingLink: "",
    location: "",
    instructions: "",
  });

  const loadApplications = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
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
        throw new Error(data.message || "Failed to load applications");
      }

      setApplications(data.applications || []);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [jobId]);

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

      if (data.application) {
        setApplications((previous) =>
          previous.map((application) =>
            application._id === applicationId
              ? data.application
              : application
          )
        );
      } else {
        await loadApplications(false);
      }

      alert(`Application updated to ${status}`);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openScheduleForm = (applicationId) => {
    setScheduleFor(applicationId);
    setScheduleMessage("");
    setScheduleError("");

    setInterviewData({
      interviewDate: "",
      interviewMode: "Online",
      meetingLink: "",
      location: "",
      instructions: "",
    });
  };

  const handleInterviewChange = (e) => {
    const { name, value } = e.target;

    setInterviewData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const scheduleInterview = async (e, applicationId) => {
    e.preventDefault();

    setScheduleError("");
    setScheduleMessage("");

    if (new Date(interviewData.interviewDate) <= new Date()) {
      setScheduleError("Please select a future interview date and time.");
      return;
    }

    if (
      interviewData.interviewMode === "Online" &&
      !interviewData.meetingLink.trim()
    ) {
      setScheduleError("Please provide an online meeting link.");
      return;
    }

    if (
      interviewData.interviewMode === "Offline" &&
      !interviewData.location.trim()
    ) {
      setScheduleError("Please provide the interview location.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setScheduleError("Please login again.");
      return;
    }

    try {
      setScheduleLoadingId(applicationId);

      const response = await fetch(
        `${API_URL}/interviews/schedule/${applicationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            interviewDate: interviewData.interviewDate,
            interviewMode: interviewData.interviewMode,
            meetingLink: interviewData.meetingLink.trim(),
            location: interviewData.location.trim(),
            instructions: interviewData.instructions.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setScheduleError(
          data.message || "Failed to schedule interview."
        );
        return;
      }

      setScheduleMessage("Interview scheduled successfully!");
      setScheduleFor(null);

      await loadApplications(false);
    } catch (error) {
      console.error("SCHEDULE INTERVIEW ERROR:", error);
      setScheduleError("Unable to connect to the server.");
    } finally {
      setScheduleLoadingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "app-status-selected";
      case "Rejected":
        return "app-status-rejected";
      case "Shortlisted":
        return "app-status-shortlisted";
      case "Under Review":
        return "app-status-review";
      default:
        return "app-status-applied";
    }
  };

  const getLocalDateTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  if (loading) {
    return (
      <div className="company-applications-page">
        <div className="applications-loading">
          <div className="applications-loader"></div>
          <h2>Loading applicants...</h2>
          <p>Please wait while we fetch the applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-applications-page">
      <div className="company-applications-container">

        <div className="applications-header">
          <div>
            <span className="applications-eyebrow">
              RECRUITMENT WORKSPACE
            </span>
            <h1>Job Applicants</h1>
            <p>Review candidates and manage your hiring process.</p>
          </div>

          <Link to="/company-jobs" className="applications-back-link">
            ← Back to My Posted Jobs
          </Link>
        </div>

        <div className="applicant-summary">
          <div className="applicant-summary-card">
            <span>Total Applications</span>
            <strong>{applications.length}</strong>
          </div>

          <div className="applicant-summary-card">
            <span>Shortlisted</span>
            <strong>
              {applications.filter((a) => a.status === "Shortlisted").length}
            </strong>
          </div>

          <div className="applicant-summary-card">
            <span>Selected</span>
            <strong>
              {applications.filter((a) => a.status === "Selected").length}
            </strong>
          </div>

          <div className="applicant-summary-card">
            <span>Under Review</span>
            <strong>
              {applications.filter((a) => a.status === "Under Review").length}
            </strong>
          </div>
        </div>

        {message && (
          <div className="applications-alert applications-error">
            {message}
          </div>
        )}

        {scheduleMessage && (
          <div className="applications-alert applications-success">
            {scheduleMessage}
          </div>
        )}

        {!message && applications.length === 0 && (
          <div className="applications-empty">
            <div className="applications-empty-icon">▤</div>
            <h2>No Applications Yet</h2>
            <p>
              Students who apply for this job will appear here.
            </p>
            <Link to="/company-jobs">Back to My Posted Jobs</Link>
          </div>
        )}

        <div className="applicants-list">
          {applications.map((application, index) => {
            const status = application.status || "Applied";
            const history = application.statusHistory || [];

            const resumeUrl = application.resumeUrl
              ? `${API_BASE_URL}${application.resumeUrl}`
              : null;

            const studentName =
              application.student?.name || "Student Application";

            const interviews = application.interviews || [];

            return (
              <div className="applicant-card" key={application._id}>
                <div className="applicant-card-header">
                  <div className="applicant-identity">
                    <div className="applicant-avatar">
                      {studentName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <span className="applicant-number">
                        APPLICANT {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2>{studentName}</h2>
                      <p>{application.student?.email || "Email not available"}</p>
                    </div>
                  </div>

                  <span className={`app-status ${getStatusClass(status)}`}>
                    {status}
                  </span>
                </div>

                <div className="applicant-card-body">
                  <div className="applicant-section">
                    <h3>Candidate Resume</h3>

                    {resumeUrl ? (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="applicant-resume-link"
                      >
                        View / Download Resume <span>↗</span>
                      </a>
                    ) : (
                      <p className="applicant-muted">
                        Resume not available for this application.
                      </p>
                    )}
                  </div>

                  <div className="applicant-section">
                    <h3>Cover Letter</h3>
                    <div className="applicant-cover-letter">
                      {application.coverLetter || "No cover letter provided."}
                    </div>
                  </div>

                  <div className="applicant-meta">
                    <span>Applied On</span>
                    <strong>
                      {application.appliedDate || application.createdAt
                        ? new Date(
                            application.appliedDate || application.createdAt
                          ).toLocaleDateString()
                        : "Date unavailable"}
                    </strong>
                  </div>

                  <div className="applicant-section">
                    <h3>Application History</h3>

                    {history.length === 0 ? (
                      <p className="applicant-muted">
                        No status history available.
                      </p>
                    ) : (
                      <div className="applicant-history">
                        {history.map((item, historyIndex) => (
                          <div className="applicant-history-item" key={historyIndex}>
                            <span className="history-dot"></span>
                            <div>
                              <strong>{item.status}</strong>
                              <p>
                                {item.changedAt
                                  ? new Date(item.changedAt).toLocaleString()
                                  : "Date unavailable"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {interviews.length > 0 && (
                    <div className="applicant-section">
                      <h3>Scheduled Interviews</h3>

                      {interviews.map((interview, interviewIndex) => (
                        <div
                          className="scheduled-interview-item"
                          key={interview._id || interviewIndex}
                        >
                          <strong>
                            {interview.interviewMode || "Interview"} Interview
                          </strong>
                          <p>
                            {interview.interviewDate
                              ? new Date(interview.interviewDate).toLocaleString()
                              : "Date not available"}
                          </p>
                          <span>
                            {interview.status || "Scheduled"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="applicant-actions-section">
                  <h3>Update Application Status</h3>

                  <div className="applicant-status-actions">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        disabled={
                          updatingId === application._id ||
                          status === option
                        }
                        onClick={() => updateStatus(application._id, option)}
                        className={`applicant-status-btn ${getStatusClass(option)}`}
                      >
                        {updatingId === application._id
                          ? "Updating..."
                          : option}
                      </button>
                    ))}
                  </div>

                  <button
                    className="schedule-interview-btn"
                    onClick={() => openScheduleForm(application._id)}
                    disabled={
                      status === "Rejected" ||
                      scheduleLoadingId === application._id
                    }
                  >
                    Schedule Interview
                    <span>→</span>
                  </button>

                  {scheduleFor === application._id && (
                    <form
                      className="interview-schedule-form"
                      onSubmit={(e) =>
                        scheduleInterview(e, application._id)
                      }
                    >
                      <div className="interview-form-heading">
                        <div>
                          <span>INTERVIEW SETUP</span>
                          <h3>Schedule an Interview</h3>
                        </div>

                        <button
                          type="button"
                          className="close-interview-form"
                          onClick={() => setScheduleFor(null)}
                        >
                          ×
                        </button>
                      </div>

                      {scheduleError && (
                        <div className="applications-alert applications-error">
                          {scheduleError}
                        </div>
                      )}

                      <div className="interview-form-grid">
                        <div className="interview-form-field full-width">
                          <label>Interview Date and Time *</label>
                          <input
                            type="datetime-local"
                            name="interviewDate"
                            value={interviewData.interviewDate}
                            onChange={handleInterviewChange}
                            min={getLocalDateTime()}
                            required
                          />
                        </div>

                        <div className="interview-form-field full-width">
                          <label>Interview Mode *</label>
                          <select
                            name="interviewMode"
                            value={interviewData.interviewMode}
                            onChange={handleInterviewChange}
                          >
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                          </select>
                        </div>

                        {interviewData.interviewMode === "Online" && (
                          <div className="interview-form-field full-width">
                            <label>Meeting Link *</label>
                            <input
                              type="url"
                              name="meetingLink"
                              value={interviewData.meetingLink}
                              onChange={handleInterviewChange}
                              placeholder="https://meet.google.com/..."
                              required
                            />
                          </div>
                        )}

                        {interviewData.interviewMode === "Offline" && (
                          <div className="interview-form-field full-width">
                            <label>Interview Location *</label>
                            <input
                              type="text"
                              name="location"
                              value={interviewData.location}
                              onChange={handleInterviewChange}
                              placeholder="Enter office address"
                              required
                            />
                          </div>
                        )}

                        <div className="interview-form-field full-width">
                          <label>Additional Instructions</label>
                          <textarea
                            name="instructions"
                            value={interviewData.instructions}
                            onChange={handleInterviewChange}
                            placeholder="Add interview instructions for the student..."
                            rows="3"
                          />
                        </div>
                      </div>

                      <div className="interview-form-actions">
                        <button
                          type="submit"
                          className="confirm-interview-btn"
                          disabled={scheduleLoadingId === application._id}
                        >
                          {scheduleLoadingId === application._id
                            ? "Scheduling..."
                            : "Confirm Interview"}
                        </button>

                        <button
                          type="button"
                          className="cancel-interview-btn"
                          onClick={() => setScheduleFor(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default CompanyApplications;
