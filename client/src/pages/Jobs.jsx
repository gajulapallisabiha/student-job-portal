
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [sort, setSort] = useState("newest");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role?.toUpperCase();

  useEffect(() => {
    fetchJobs();

    if (token && role === "STUDENT") {
      fetchSavedJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        setMessage(data.message || "Unable to load jobs.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setMessage("Unable to load jobs. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSavedJobs(
          (data.savedJobs || [])
            .filter(Boolean)
            .map((job) => String(job._id))
        );
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const toggleSaveJob = async (jobId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "STUDENT") {
      setMessage("Only student accounts can save jobs.");
      return;
    }

    const isSaved = savedJobs.includes(String(jobId));

    try {
      const response = await fetch(
        `${API_URL}/jobs/${jobId}/save`,
        {
          method: isSaved ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update saved jobs");
      }

      setSavedJobs((previous) =>
        isSaved
          ? previous.filter((id) => id !== String(jobId))
          : [...previous, String(jobId)]
      );

      setMessage(
        isSaved
          ? "Job removed from saved jobs."
          : "Job saved successfully!"
      );

      setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.description?.toLowerCase().includes(searchText) ||
        (job.skills || []).some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesLocation = location
        ? job.location?.toLowerCase().includes(location.toLowerCase())
        : true;

      const matchesType = jobType
        ? job.type === jobType
        : true;

      return matchesSearch && matchesLocation && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sort === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

  const inputStyle = {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #66515f",
    background: "#29232d",
    color: "#fff5fa",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "11px 18px",
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
        Loading jobs...
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
        <h1 style={{ color: "#f5a2c5", marginBottom: "8px" }}>
          Explore Jobs
        </h1>

        <p style={{ color: "#d8c3d0", marginBottom: "25px" }}>
          Discover opportunities and find your next career move.
        </p>

        {message && (
          <div
            style={{
              background: "#493142",
              color: "#ffd5e7",
              padding: "12px",
              borderRadius: "9px",
              marginBottom: "18px",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "14px",
            background: "#322b35",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "25px",
          }}
        >
          <input
            style={inputStyle}
            placeholder="Search title, company or skills"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            style={inputStyle}
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>

          <select
            style={inputStyle}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <h3>{filteredJobs.length} Jobs Found</h3>

          <button
            style={{
              ...buttonStyle,
              background: "#493142",
            }}
            onClick={() => {
              setSearch("");
              setLocation("");
              setJobType("");
              setSort("newest");
            }}
          >
            Clear Filters
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <div
            style={{
              background: "#322b35",
              padding: "35px",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >
            <h3>No matching jobs found</h3>
            <p style={{ color: "#d8c3d0" }}>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(String(job._id));

              return (
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h2 style={{ color: "#f5a2c5", fontSize: "21px", margin: "0 0 7px" }}>
                        {job.title}
                      </h2>
                      <p style={{ margin: 0, color: "#e5d3de" }}>
                        {job.company}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job._id)}
                      title={isSaved ? "Remove bookmark" : "Save job"}
                      aria-label={isSaved ? "Remove saved job" : "Save job"}
                      style={{
                        background: isSaved ? "#e85a9b" : "#493142",
                        color: "white",
                        border: "1px solid #e85a9b",
                        borderRadius: "10px",
                        padding: "9px 12px",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {isSaved ? "♥" : "♡"}
                    </button>
                  </div>

                  <p style={{ color: "#d8c3d0", margin: 0 }}>
                    <strong>Location:</strong> {job.location}
                  </p>

                  <p style={{ color: "#d8c3d0", margin: 0 }}>
                    <strong>Type:</strong> {job.type}
                  </p>

                  <p style={{ color: "#d8c3d0", margin: 0 }}>
                    <strong>Salary:</strong> {job.salary || "Not specified"}
                  </p>

                  {job.skills?.length > 0 && (
                    <p style={{ color: "#d8c3d0", margin: 0 }}>
                      <strong>Skills:</strong> {job.skills.join(", ")}
                    </p>
                  )}

                  <p style={{ color: "#d8c3d0", fontSize: "14px", lineHeight: "1.6", flex: 1 }}>
                    {job.description?.length > 160
                      ? `${job.description.substring(0, 160)}...`
                      : job.description}
                  </p>

                  <button
                    style={buttonStyle}
                    onClick={() => navigate("/apply", { state: { job } })}
                  >
                    Apply Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
