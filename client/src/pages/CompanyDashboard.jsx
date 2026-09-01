import { Link, useNavigate } from "react-router-dom";

function CompanyDashboard() {
  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        <h1>Company Dashboard</h1>

        <p>
          Welcome,
          {" "}
          <strong>
            {user.name || "Company"}
          </strong>
        </p>

        <hr />

        <h2>Company Actions</h2>

        <div style={styles.cards}>

          <Link
            to="/post-job"
            style={styles.card}
          >
            <h3>Post a Job</h3>
            <p>
              Create a new internship or
              job opportunity.
            </p>
          </Link>

          <Link
            to="/company-jobs"
            style={styles.card}
          >
            <h3>My Posted Jobs</h3>
            <p>
              View and manage your posted jobs.
            </p>
          </Link>

        </div>

        <button
          onClick={logout}
          style={styles.logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "50px",
  },

  container: {
    maxWidth: "900px",
    margin: "auto",
    background: "white",
    padding: "35px",
    borderRadius: "12px",
  },

  cards: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    width: "250px",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#222",
  },

  logout: {
    marginTop: "30px",
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
};

export default CompanyDashboard;

