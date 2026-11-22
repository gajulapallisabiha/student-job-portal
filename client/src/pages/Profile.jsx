
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
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
    return (
      <div className="profile-message">
        <div className="profile-loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  const initials = (profile.name || "Student")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const skills = skillsInput
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* PROFILE HEADER */}
        <div className="profile-hero">
          <div className="profile-hero-content">
            <span className="profile-eyebrow">
              STUDENT ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal details, academic information,
              skills and professional resume.
            </p>
          </div>

          <button
            type="button"
            className="profile-back-button"
            onClick={() => navigate("/jobs")}
          >
            <span>←</span> Back to Jobs
          </button>
        </div>

        {/* PROFILE IDENTITY */}
        <div className="profile-identity-card">
          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-identity-details">
            <h2>{profile.name || "Your Name"}</h2>
            <p>{profile.email || "Your email address"}</p>

            <div className="profile-identity-tags">
              <span>Student</span>
              {profile.education && (
                <span>{profile.education}</span>
              )}
            </div>
          </div>

          <div className="profile-identity-status">
            <span className="profile-status-dot"></span>
            Profile Management
          </div>
        </div>

        {/* ALERT MESSAGES */}
        {message && (
          <div className="profile-alert profile-success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="profile-alert profile-error">
            <span>!</span>
            {error}
          </div>
        )}

        {/* PERSONAL INFORMATION FORM */}
        <form onSubmit={handleSubmit}>

          <div className="profile-section-heading">
            <div>
              <span className="profile-section-label">
                YOUR INFORMATION
              </span>
              <h2>Personal Details</h2>
              <p>Keep your profile information up to date.</p>
            </div>
          </div>

          <div className="profile-grid">

            {/* PERSONAL INFORMATION */}
            <div className="profile-card">
              <div className="profile-card-heading">
                <div className="profile-card-icon">01</div>
                <div>
                  <h3>Personal Information</h3>
                  <p>Your basic contact details</p>
                </div>
              </div>

              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>Full Name</label>
                  <input
                    name="name"
                    value={profile.name || ""}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    disabled
                  />
                  <small>Email cannot be changed here.</small>
                </div>

                <div className="profile-form-group">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="profile-form-group">
                  <label>Location</label>
                  <input
                    name="location"
                    value={profile.location || ""}
                    onChange={handleChange}
                    placeholder="Enter your city or location"
                  />
                </div>
              </div>
            </div>

            {/* EDUCATION */}
            <div className="profile-card">
              <div className="profile-card-heading">
                <div className="profile-card-icon">02</div>
                <div>
                  <h3>Education Details</h3>
                  <p>Your academic background</p>
                </div>
              </div>

              <div className="profile-form-group">
                <label>Education</label>
                <input
                  name="education"
                  value={profile.education || ""}
                  onChange={handleChange}
                  placeholder="Example: B.Sc Computer Science"
                />
              </div>
            </div>

            {/* ABOUT ME */}
            <div className="profile-card">
              <div className="profile-card-heading">
                <div className="profile-card-icon">03</div>
                <div>
                  <h3>About Me</h3>
                  <p>Introduce yourself to employers</p>
                </div>
              </div>

              <div className="profile-form-group">
                <label>Professional Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                  placeholder="Write about your interests, experience, career goals and achievements..."
                  rows="5"
                />
              </div>
            </div>

            {/* SKILLS */}
            <div className="profile-card">
              <div className="profile-card-heading">
                <div className="profile-card-icon">04</div>
                <div>
                  <h3>Technical Skills</h3>
                  <p>Highlight your technical abilities</p>
                </div>
              </div>

              <div className="profile-form-group">
                <label>Your Skills</label>
                <input
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, JavaScript, Python, MongoDB"
                />

                <small>
                  Separate each skill with a comma.
                </small>
              </div>

              {skills.length > 0 && (
                <div className="profile-skills-preview">
                  <span className="skills-preview-label">
                    SKILLS PREVIEW
                  </span>

                  <div className="profile-skill-tags">
                    {skills.map((skill, index) => (
                      <span key={`${skill}-${index}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="profile-save-area">
            <p>
              Make sure your information is accurate before saving.
            </p>

            <button
              type="submit"
              className="profile-save-button"
            >
              Save Profile <span>→</span>
            </button>
          </div>
        </form>

        {/* RESUME MANAGEMENT */}
        <div className="profile-section-heading resume-section-heading">
          <div>
            <span className="profile-section-label">
              CAREER DOCUMENTS
            </span>
            <h2>Resume Management</h2>
            <p>Upload your latest resume to apply for opportunities.</p>
          </div>
        </div>

        <div className="profile-card profile-resume-card">
          <div className="profile-resume-top">
            <div className="profile-resume-icon">
              PDF
            </div>

            <div>
              <h3>Your Professional Resume</h3>
              <p>
                Upload a clear and updated PDF version of your resume.
              </p>
            </div>

            {profile.resumeUrl && (
              <span className="resume-uploaded-badge">
                ✓ Uploaded
              </span>
            )}
          </div>

          <form onSubmit={handleResumeUpload}>
            <div className="profile-upload-area">
              <div className="profile-upload-symbol">
                ↑
              </div>

              <div className="profile-upload-text">
                <h4>Select your resume</h4>
                <p>PDF format only · Maximum file size 5 MB</p>
              </div>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) =>
                  setResumeFile(e.target.files[0] || null)
                }
              />
            </div>

            {resumeFile && (
              <div className="profile-selected-file">
                <span>Selected file:</span>
                <strong>{resumeFile.name}</strong>
              </div>
            )}

            <button
              type="submit"
              className="profile-upload-button"
              disabled={uploading}
            >
              {uploading ? "Uploading Resume..." : "Upload Resume"}
              {!uploading && <span>↑</span>}
            </button>
          </form>

          {profile.resumeUrl && (
            <div className="profile-resume-success">
              <div>
                <strong>Resume successfully uploaded</strong>
                <p>Your resume is available to view.</p>
              </div>

              <a
                href={`${API_BASE_URL}${profile.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                View Resume →
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
