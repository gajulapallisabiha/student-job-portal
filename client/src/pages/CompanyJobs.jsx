import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login as a company first.");
      setLoading(false);
      return;
    }

    try {
      /*
       * We use the main jobs endpoint here.
       * The backend can return the jobs and we filter
       * them on the frontend using the logged-in company.
       */
      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("All jobs response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch jobs"
        );
      }

      let allJobs = [];

      if (Array.isArray(data)) {
        allJobs = data;
      } else if (Array.isArray(data.jobs)) {
        allJobs = data.jobs;
      }

      /*
       * Get logged-in company information
       */
      const savedUser =
        localStorage.getItem("user");

      let user = null;

      if (savedUser) {
        user = JSON.parse(savedUser);
      }

      /*
       * Filter jobs belonging to this company.
       *
       * Different backends may store the company as:
       * job.company
       * job.company._id
       * job.companyId
       */
      const companyId =
        user?._id || user?.id;

      const companyJobs = allJobs.filter(
        (job) => {
          const jobCompany =
            job.company?._id ||
            job.company ||
            job.companyId;

          return (
            String(jobCompany) ===
            String(companyId)
          );
        }
      );

      setJobs(companyJobs);
      setLoading(false);

    } catch (error) {
      console.error(
        "COMPANY JOBS ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Failed to fetch jobs"
      );

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>My Posted Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <h1>My Posted Jobs</h1>

      <Link to="/company-dashboard">
        <button>
          Back to Dashboard
        </button>
      </Link>

      <br />
      <br />

      {message && (
        <div style={styles.error}>
          {message}
        </div>
      )}

      {!message &&
        jobs.length === 0 && (
          <div>
            <p>
              You have not posted any jobs yet.
            </p>

            <Link to="/post-job">
              <button>
                Post Your First Job
              </button>
            </Link>
          </div>
        )}

      {jobs.map((job) => (
        <div
          key={job._id}
          style={styles.card}
        >

          <h2>{job.title}</h2>

          <p>
            <strong>Description:</strong>
            <br />
            {job.description}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {job.location}
          </p>

          <p>
            <strong>Salary / Stipend:</strong>{" "}
            {job.salary ||
              "Not specified"}
          </p>

          <p>
            <strong>Job Type:</strong>{" "}
            {job.type ||
              job.jobType ||
              "Not specified"}
          </p>

          <Link
            to={`/company-jobs/${job._id}/applications`}
          >
            <button>
              View Applicants
            </button>
          </Link>

        </div>
      ))}

    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
  },

  card: {
    border: "1px solid #ccc",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "10px",
    maxWidth: "700px",
  },

  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: "20px",
  },
};

export default CompanyJobs;

