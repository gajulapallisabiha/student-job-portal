
import { Link, useNavigate } from "react-router-dom";
import "./CompanyDashboard.css";

function CompanyDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="company-dashboard">
      <div className="company-dashboard-container">

        {/* Welcome Section */}
        <section className="company-welcome">
          <div className="company-welcome-content">
            <span className="company-eyebrow">
              COMPANY WORKSPACE
            </span>

            <h1>
              Welcome back, <span>{user.name || "Company"}</span>
            </h1>

            <p>
              Manage your job opportunities, discover talented candidates
              and organize your recruitment activities from one place.
            </p>

            <Link to="/post-job" className="company-primary-btn">
              + Post a New Job
            </Link>
          </div>

          <div className="company-welcome-decoration">
            <div className="company-decoration-circle">
              <span>✦</span>
            </div>
          </div>
        </section>

        {/* Dashboard Heading */}
        <div className="company-section-heading">
          <div>
            <span>YOUR WORKSPACE</span>
            <h2>Company Actions</h2>
            <p>Everything you need to manage recruitment.</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="company-action-grid">

          <Link to="/post-job" className="company-action-card">
            <div className="company-action-top">
              <div className="company-action-icon">＋</div>
              <span className="company-action-arrow">↗</span>
            </div>

            <span className="company-card-label">CREATE OPPORTUNITY</span>
            <h3>Post a Job</h3>
            <p>
              Publish new internship and job openings to attract
              talented students and professionals.
            </p>

            <div className="company-card-footer">
              <span>Create job opening</span>
              <span>→</span>
            </div>
          </Link>

          <Link to="/company-jobs" className="company-action-card">
            <div className="company-action-top">
              <div className="company-action-icon">▤</div>
              <span className="company-action-arrow">↗</span>
            </div>

            <span className="company-card-label">MANAGE OPPORTUNITIES</span>
            <h3>My Posted Jobs</h3>
            <p>
              View your published jobs, manage openings and
              keep track of your recruitment activity.
            </p>

            <div className="company-card-footer">
              <span>Manage job listings</span>
              <span>→</span>
            </div>
          </Link>

          <Link to="/company-interviews" className="company-action-card">
            <div className="company-action-top">
              <div className="company-action-icon">◷</div>
              <span className="company-action-arrow">↗</span>
            </div>

            <span className="company-card-label">CANDIDATE MANAGEMENT</span>
            <h3>Interview Management</h3>
            <p>
              Schedule interviews, review upcoming meetings and
              manage candidate interview updates.
            </p>

            <div className="company-card-footer">
              <span>Manage interviews</span>
              <span>→</span>
            </div>
          </Link>

        </div>

        {/* Bottom Section */}
        <section className="company-dashboard-bottom">
          <div>
            <span className="company-bottom-label">RECRUITMENT HUB</span>
            <h3>Build your team with the right talent.</h3>
            <p>
              Keep your job listings updated and stay organized
              throughout your hiring process.
            </p>
          </div>

          <button
            className="company-logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </section>

      </div>
    </div>
  );
}

export default CompanyDashboard;
