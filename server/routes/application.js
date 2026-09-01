const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const router = express.Router();

// ========================================
// STUDENT - Apply for a job
// POST /api/applications
// ========================================

router.post("/", applyForJob);


// ========================================
// STUDENT - View my applications
// GET /api/applications/my-applications
// ========================================

router.get(
  "/my-applications",
  getMyApplications
);


// ========================================
// COMPANY - View applications for a job
// GET /api/applications/job/:jobId
// ========================================

router.get(
  "/job/:jobId",
  getApplicationsForJob
);


// ========================================
// COMPANY - Accept / Reject application
// PUT /api/applications/:id/status
// ========================================

router.put(
  "/:id/status",
  updateApplicationStatus
);


module.exports = router;

