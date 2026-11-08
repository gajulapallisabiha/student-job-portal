
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/applications/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch applications"
          );
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading applications...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/jobs")}
          style={{
            padding: "10px 18px",
            marginBottom: "25px",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
          }}
        >
          ← Back to Jobs
        </button>

        <h1>My Applications</h1>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {!error && applications.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            <h3>No applications yet.</h3>
            <p>Apply for a job to see your applications here.</p>
          </div>
        )}

        <div>
          {applications.map((application) => (
            <div
              key={application._id}
              style={{
                background: "white",
                padding: "25px",
                marginTop: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
              }}
            >
              <h2>
                {application.job?.title || "Job"}
              </h2>

              <h3>
                {application.job?.company || "Company"}
              </h3>

              <p>
                <strong>Status:</strong>{" "}
                {application.status}
              </p>

              <p>
                <strong>Applied:</strong>{" "}
                {new Date(
                  application.appliedDate
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {application.job?.location || "N/A"}
              </p>

              <p>
                <strong>Cover Letter:</strong>
              </p>

              <p>{application.coverLetter}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Applications;
