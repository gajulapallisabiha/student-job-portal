import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.jobs) {
          setJobs(data.jobs);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const submitApplication = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            jobId: selectedJob._id,
            coverLetter: coverLetter,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Application failed."
        );
        return;
      }

      setMessage(
        "Application submitted successfully!"
      );

      setCoverLetter("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Available Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Available Jobs</h1>

        <Link to="/my-applications">
          <button>
            My Applications
          </button>
        </Link>
      </div>

      {jobs.length === 0 && (
        <p>No jobs available.</p>
      )}

      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{job.title}</h2>

          <p>
            <strong>Company:</strong>{" "}
            {job.company ||
              job.companyName ||
              "Not specified"}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {job.description ||
              "No description"}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {job.location ||
              "Not specified"}
          </p>

          <button
            onClick={() => {
              setSelectedJob(job);
              setCoverLetter("");
              setMessage("");
            }}
          >
            Apply Now
          </button>
        </div>
      ))}

      {selectedJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              width: "90%",
              maxWidth: "600px",
              borderRadius: "10px",
            }}
          >
            <h2>
              Apply for {selectedJob.title}
            </h2>

            <form onSubmit={submitApplication}>
              <label>
                Cover Letter
              </label>

              <br />
              <br />

              <textarea
                rows="8"
                value={coverLetter}
                onChange={(event) =>
                  setCoverLetter(
                    event.target.value
                  )
                }
                placeholder="Write your cover letter..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                }}
                required
              />

              <br />
              <br />

              <button type="submit">
                Submit Application
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedJob(null);
                  setMessage("");
                }}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </form>

            {message && (
              <p>
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;

