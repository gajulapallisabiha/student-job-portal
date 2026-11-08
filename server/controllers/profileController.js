
const User = require("../models/User");

// GET STUDENT PROFILE
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE STUDENT PROFILE
const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, location, education, bio, skills } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (education !== undefined) user.education = education;
    if (bio !== undefined) user.bio = bio;

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array",
        });
      }

      user.skills = skills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    await user.save();

    const updatedProfile = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
