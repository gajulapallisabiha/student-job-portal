const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const uploadResume = require("../middleware/applicationUpload");

const router = express.Router();

// Student routes
router.post(
  "/",
  protect,
  authorize("STUDENT"),
  uploadResume.single("resume"),
  applyForJob
);

router.get(
  "/my-applications",
  protect,
  authorize("STUDENT"),
  getMyApplications
);

// Company routes
router.get(
  "/job/:jobId",
  protect,
  authorize("COMPANY"),
  getApplicationsForJob
);

router.put(
  "/:id/status",
  protect,
  authorize("COMPANY"),
  updateApplicationStatus
);

module.exports = router;