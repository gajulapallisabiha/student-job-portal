import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function CompanyApplications() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/applications/job/${jobId}`,
      {
        headers: {
          Authorization:
            "Bearer " + token,
        },
      }
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load applications"
          );
        }

        return data;
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setApplications(data);
        } else if (
          Array.isArray(data.applications)
        ) {
          setApplications(
            data.applications
          );
        } else {
          setApplications([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setMessage(error.message);
        setLoading(false);
      });
  }, [jobId]);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Job Applicants</h1>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Job Applicants</h1>

      <Link to="/company-jobs">
        <button>
          Back to My Posted Jobs
        </button>
      </Link>

      <br />
      <br />

      {message && (
        <p style={{ color: "red" }}>
          {message}
        </p>
      )}

      {!message &&
        applications.length === 0 && (
          <p>
            No students have applied
            for this job yet.
          </p>
        )}

      {applications.map(
        (application) => (
          <div
            key={application._id}
            style={styles.card}
          >
            <h2>
              Student Application
            </h2>

            <p>
              <strong>
                Student Name:
              </strong>{" "}
              {application.student?.name ||
                application.studentName ||
                "Not available"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {application.student?.email ||
                application.email ||
                "Not available"}
            </p>

            <p>
              <strong>
                Cover Letter:
              </strong>
            </p>

            <p>
              {application.coverLetter ||
                "No cover letter"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {application.status ||
                "Pending"}
            </p>

            <div>
              <button
                onClick={() =>
                  updateStatus(
                    application._id,
                    "Accepted"
                  )
                }
              >
                Accept
              </button>

              {" "}

              <button
                onClick={() =>
                  updateStatus(
                    application._id,
                    "Rejected"
                  )
                }
              >
                Reject
              </button>
            </div>

          </div>
        )
      )}

    </div>
  );

  async function updateStatus(
    applicationId,
    status
  ) {
    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              "Bearer " + token,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update status"
        );
        return;
      }

      setApplications(
        (previous) =>
          previous.map(
            (application) =>
              application._id ===
              applicationId
                ? {
                    ...application,
                    status,
                  }
                : application
          )
      );

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to server."
      );
    }
  }
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    marginTop: "20px",
    maxWidth: "700px",
    borderRadius: "10px",
  },
};

export default CompanyApplications;

