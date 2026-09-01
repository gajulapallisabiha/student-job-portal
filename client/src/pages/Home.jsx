import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="home-navbar">

        <div className="home-logo">
          <span className="logo-icon">🎓</span>
          <span>Student Job Portal</span>
        </div>

        <div className="home-nav-links">
          <Link to="/login" className="home-login">
            Login
          </Link>

          <Link to="/register" className="home-register">
            Register
          </Link>
        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="home-hero">

        <div className="hero-badge">
          🚀 Start Your Career Journey
        </div>

        <h1>
          Find Your Dream
          <span> Internship or Job</span>
        </h1>

        <p>
          Discover exciting career opportunities,
          connect with companies, and take the next
          step toward your professional future.
        </p>

        <div className="hero-buttons">

          <Link to="/login">
            <button className="home-primary-button">
              🔍 Find Jobs
            </button>
          </Link>

          <Link to="/register">
            <button className="home-secondary-button">
              ✨ Create Account
            </button>
          </Link>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="home-features">

        <div className="home-feature-card">

          <div className="home-feature-icon student-icon">
            👨‍🎓
          </div>

          <h2>For Students</h2>

          <p>
            Find internships and job opportunities,
            apply online, and track your applications
            easily.
          </p>

          <Link to="/register">
            Get Started →
          </Link>

        </div>


        <div className="home-feature-card">

          <div className="home-feature-icon company-icon">
            🏢
          </div>

          <h2>For Companies</h2>

          <p>
            Post job opportunities, discover talented
            students, and manage applications in one
            place.
          </p>

          <Link to="/register">
            Post a Job →
          </Link>

        </div>


        <div className="home-feature-card">

          <div className="home-feature-icon easy-icon">
            ⚡
          </div>

          <h2>Simple & Easy</h2>

          <p>
            A modern and simple platform designed to
            make finding jobs and hiring students easier.
          </p>

          <Link to="/login">
            Explore Portal →
          </Link>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="home-stats">

        <div className="home-stat-card">

          <div className="stat-icon">
            🎓
          </div>

          <div>
            <h3>Students</h3>
            <p>Build your career</p>
          </div>

        </div>


        <div className="home-stat-card">

          <div className="stat-icon">
            💼
          </div>

          <div>
            <h3>Job Opportunities</h3>
            <p>Find your next opportunity</p>
          </div>

        </div>


        <div className="home-stat-card">

          <div className="stat-icon">
            🏢
          </div>

          <div>
            <h3>Companies</h3>
            <p>Hire talented students</p>
          </div>

        </div>


        <div className="home-stat-card">

          <div className="stat-icon">
            🚀
          </div>

          <div>
            <h3>Career Growth</h3>
            <p>Grow professionally</p>
          </div>

        </div>

      </section>


      {/* ================= CALL TO ACTION ================= */}

      <section className="home-cta">

        <div className="cta-content">

          <div className="cta-icon">
            🚀
          </div>

          <h2>
            Ready to Start Your Career?
          </h2>

          <p>
            Create your account today and discover
            exciting internships and job opportunities.
          </p>

          <Link to="/register">
            <button className="cta-button">
              Create Your Account →
            </button>
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="footer-logo">
          🎓 Student Job Portal
        </div>

        <p>
          Connecting students with career opportunities.
        </p>

        <div className="footer-line"></div>

        <span>
          © 2026 Student Job Portal. All rights reserved.
        </span>

      </footer>

    </div>
  );
}

export default Home;

