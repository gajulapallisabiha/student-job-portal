
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import "./CompanyJobs.css";

function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return {
          jobs: [],
          message: "Please login as a company first.",
        };
      }

      const response = await fetch(`${API_URL}/jobs/my-jobs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("MY COMPANY JOBS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      return {
        jobs: data.jobs || [],
        message: "",
      };
    } catch (error) {
      console.error("COMPANY JOBS ERROR:", error);

      return {
        jobs: [],
        message: error.message,
      };
    }
  };

  useEffect(() => {
    let isMounted = true;

    loadJobs().then((result) => {
      if (isMounted) {
        setJobs(result.jobs);
        setMessage(result.message);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job");
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job._id !== jobId)
      );

      alert("Job deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="company-jobs-page">
        <div className="jobs-loading">
          <div className="jobs-spinner"></div>
          <h2>Loading your jobs...</h2>
          <p>Please wait while we fetch your posted jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-jobs-page">
      <div className="company-jobs-container">

        {/* HEADER */}
        <div className="company-jobs-header">
          <div>
            <span className="jobs-eyebrow">RECRUITMENT MANAGEMENT</span>
            <h1>My Posted Jobs</h1>
            <p>
              Manage your job postings and keep track of applicants.
            </p>
          </div>

          <div className="jobs-header-actions">
            <Link to="/company-dashboard" className="jobs-back-btn">
              Back to Dashboard
            </Link>

            <Link to="/post-job" className="jobs-create-btn">
              + Post New Job
            </Link>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="jobs-summary-card">
          <div className="jobs-summary-icon">J</div>
          <div>
            <span>Total Job Postings</span>
            <h2>{jobs.length}</h2>
          </div>
          <div className="jobs-summary-note">
            Your recruitment activity
          </div>
        </div>

        {/* ERROR */}
        {message && (
          <div className="jobs-error">
            <strong>Unable to load jobs</strong>
            <p>{message}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!message && jobs.length === 0 && (
          <div className="jobs-empty-state">
            <div className="jobs-empty-icon">+</div>
            <h2>No Jobs Posted Yet</h2>
            <p>
              You haven't posted any job opportunities.
              Start building your team by creating your first job posting.
            </p>
            <Link to="/post-job" className="jobs-create-btn">
              Post Your First Job
            </Link>
          </div>
        )}

        {/* JOB LIST */}
        {!message && jobs.length > 0 && (
          <>
            <div className="jobs-section-heading">
              <div>
                <h2>Your Job Listings</h2>
                <p>All opportunities posted by your company</p>
              </div>
              <span className="jobs-count">
                {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
              </span>
            </div>

            <div className="company-jobs-grid">
              {jobs.map((job) => (
                <div className="company-job-card" key={job._id}>

                  <div className="job-card-top">
                    <div className="job-card-icon">
                      {job.company
                        ? job.company.charAt(0).toUpperCase()
                        : "J"}
                    </div>

                    <span className="job-active-badge">
                      Posted
                    </span>
                  </div>

                  <h3>{job.title}</h3>

                  <p className="job-company-name">
                    {job.company || "Company"}
                  </p>

                  <div className="job-tags">
                    <span>{job.type || "Not specified"}</span>
                    <span>{job.location || "Location not specified"}</span>
                  </div>

                  <div className="job-card-details">
                    <div>
                      <span>Salary / Stipend</span>
                      <strong>{job.salary || "Not specified"}</strong>
                    </div>

                    <div>
                      <span>Application Deadline</span>
                      <strong>
                        {job.deadline
                          ? new Date(job.deadline).toLocaleDateString()
                          : "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div className="job-description">
                    <span>JOB DESCRIPTION</span>
                    <p>{job.description || "No description provided."}</p>
                  </div>

                  <div className="job-card-actions">
                    <Link
                      to={`/company-jobs/${job._id}/applications`}
                      className="job-applicants-btn"
                    >
                      View Applicants
                    </Link>

                    <button
                      className="job-delete-btn"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete Job
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default CompanyJobs;
