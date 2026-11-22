
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

const SavedJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load saved jobs");
      }

      setJobs(data.savedJobs || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeJob = async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}/save`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove job");
      }

      setJobs((previous) =>
        previous.filter((job) => String(job._id) !== String(jobId))
      );

      setMessage("Job removed from your saved list.");
      setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const buttonStyle = {
    padding: "11px 16px",
    border: "none",
    borderRadius: "9px",
    background: "#e85a9b",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "70px", color: "#fff5fa" }}>
        Loading saved jobs...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#252329",
        color: "#fff5fa",
        padding: "35px 6%",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        <h1 style={{ color: "#f5a2c5" }}>My Saved Jobs ♥</h1>

        <p style={{ color: "#d8c3d0", marginBottom: "25px" }}>
          All the opportunities you have bookmarked.
        </p>

        {message && (
          <p style={{ background: "#493142", padding: "12px", borderRadius: "9px", color: "#ffd5e7" }}>
            {message}
          </p>
        )}

        {jobs.length === 0 ? (
          <div
            style={{
              background: "#322b35",
              padding: "40px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h2>No saved jobs yet</h2>

            <p style={{ color: "#d8c3d0" }}>
              Browse jobs and bookmark the opportunities you like.
            </p>

            <button style={buttonStyle} onClick={() => navigate("/jobs")}>
              Explore Jobs
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: "20px" }}>
              {jobs.length} Saved Opportunities
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {jobs.filter(Boolean).map((job) => (
                <div
                  key={job._id}
                  style={{
                    background: "#322b35",
                    border: "1px solid #594354",
                    borderRadius: "15px",
                    padding: "23px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <h2 style={{ color: "#f5a2c5", margin: 0 }}>
                    {job.title}
                  </h2>

                  <p style={{ margin: 0 }}>{job.company}</p>

                  <p style={{ color: "#d8c3d0", margin: 0 }}>
                    <strong>Location:</strong> {job.location}
                  </p>

                  <p style={{ color: "#d8c3d0", margin: 0 }}>
                    <strong>Type:</strong> {job.type}
                  </p>

                  <p style={{ color: "#d8c3d0", margin: 0 }}>
                    <strong>Salary:</strong> {job.salary || "Not specified"}
                  </p>

                  <p style={{ color: "#d8c3d0", lineHeight: "1.6", flex: 1 }}>
                    {job.description?.length > 150
                      ? `${job.description.substring(0, 150)}...`
                      : job.description}
                  </p>

                  <button
                    style={buttonStyle}
                    onClick={() => navigate("/apply", { state: { job } })}
                  >
                    Apply Now
                  </button>

                  <button
                    style={{ ...buttonStyle, background: "#493142" }}
                    onClick={() => removeJob(job._id)}
                  >
                    Remove Bookmark
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
