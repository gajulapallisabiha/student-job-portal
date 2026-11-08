
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL, { API_BASE_URL } from "../api";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    bio: "",
    skills: [],
    resumeUrl: "",
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data.profile);
        setSkillsInput((data.profile.skills || []).join(", "));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const updatedProfile = {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        education: profile.education,
        bio: profile.bio,
        skills: skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setProfile(data.profile);
      setSkillsInput((data.profile.skills || []).join(", "));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!resumeFile) {
      setError("Please select a PDF resume.");
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setUploading(true);

      const response = await fetch(`${API_URL}/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume upload failed");
      }

      setProfile((previous) => ({
        ...previous,
        resumeUrl: data.resumeUrl,
      }));

      setResumeFile(null);
      e.target.reset();
      setMessage("Resume uploaded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="profile-message">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal and academic information.</p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/jobs")}
          >
            Back to Jobs
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="profile-card">
            <h2>Personal Information</h2>

            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input value={profile.email || ""} disabled />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>
          </div>

          <div className="profile-card">
            <h2>Education Details</h2>

            <div className="form-group">
              <label>Education</label>
              <input
                name="education"
                value={profile.education || ""}
                onChange={handleChange}
                placeholder="Example: B.Sc Computer Science"
              />
            </div>
          </div>

          <div className="profile-card">
            <h2>About Me</h2>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                placeholder="Write something about yourself"
                rows="4"
              />
            </div>
          </div>

          <div className="profile-card">
            <h2>Technical Skills</h2>

            <div className="form-group">
              <label>Skills</label>
              <input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, JavaScript, Python, MongoDB"
              />
              <small>Separate each skill with a comma.</small>
            </div>
          </div>

          <button type="submit" className="save-profile-button">
            Save Profile
          </button>
        </form>

        <div className="profile-card resume-card">
          <h2>Upload Resume</h2>
          <p>Upload your latest resume in PDF format (maximum 5 MB).</p>

          <form onSubmit={handleResumeUpload}>
            <div className="form-group">
              <label>Select Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0] || null)}
              />
            </div>

            <button
              type="submit"
              className="save-profile-button"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>

          {profile.resumeUrl && (
            <div className="resume-link">
              <p>Your resume is uploaded.</p>
              <a
                href={`${API_BASE_URL}${profile.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                View Uploaded Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
