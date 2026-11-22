
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getResume,
  deleteResume,
} = require("../controllers/resumeController");

// STUDENT - VIEW RESUME
router.get("/", protect, authorize("STUDENT"), getResume);

// STUDENT - UPLOAD OR REPLACE RESUME
router.post(
  "/upload",
  protect,
  authorize("STUDENT"),
  upload.single("resume"),
  uploadResume
);

// STUDENT - DELETE RESUME
router.delete("/", protect, authorize("STUDENT"), deleteResume);

module.exports = router;
