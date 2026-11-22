
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Helper: delete an uploaded resume file safely
const deleteResumeFile = (resumeUrl) => {
  if (!resumeUrl) return;

  const fileName = path.basename(resumeUrl);
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// UPLOAD OR REPLACE RESUME
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF resume to upload.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      deleteResumeFile(`/uploads/${req.file.filename}`);

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const oldResumeUrl = user.resumeUrl;

    user.resumeUrl = `/uploads/${req.file.filename}`;
    await user.save();

    // Delete old resume only after the new resume is saved
    if (oldResumeUrl) {
      deleteResumeFile(oldResumeUrl);
    }

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully!",
      resumeUrl: user.resumeUrl,
    });
  } catch (error) {
    if (req.file) {
      deleteResumeFile(`/uploads/${req.file.filename}`);
    }

    console.error("Resume upload error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Resume upload failed.",
    });
  }
};

// GET UPLOADED RESUME
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("resumeUrl");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      resumeUrl: user.resumeUrl || "",
      hasResume: Boolean(user.resumeUrl),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE UPLOADED RESUME
const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: "No resume found to delete.",
      });
    }

    const oldResumeUrl = user.resumeUrl;

    user.resumeUrl = "";
    await user.save();

    deleteResumeFile(oldResumeUrl);

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
      resumeUrl: "",
    });
  } catch (error) {
    console.error("Resume deletion error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
};
