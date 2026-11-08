
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// UPLOAD STUDENT RESUME
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
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Delete previous resume if it exists
    if (user.resumeUrl) {
      const oldFileName = path.basename(user.resumeUrl);
      const oldFilePath = path.join(
        __dirname,
        "../uploads",
        oldFileName
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Save new resume path
    user.resumeUrl = `/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully!",
      resumeUrl: user.resumeUrl,
    });
  } catch (error) {
    // Remove uploaded file if saving fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { uploadResume };
