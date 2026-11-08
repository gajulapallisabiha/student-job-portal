
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
} = require("../controllers/resumeController");

// Student resume upload API
router.post(
  "/upload",
  protect,
  authorize("STUDENT"),
  upload.single("resume"),
  uploadResume
);

module.exports = router;
