
const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Get logged-in student's profile
router.get("/", protect, authorize("STUDENT"), getMyProfile);

// Update logged-in student's profile
router.put("/", protect, authorize("STUDENT"), updateMyProfile);

module.exports = router;
