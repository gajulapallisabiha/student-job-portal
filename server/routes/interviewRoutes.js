
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  scheduleInterview,
  getMyInterviews,
  getCompanyInterviews,
  updateInterview,
} = require("../controllers/interviewController");

// ========================================
// STUDENT - VIEW MY INTERVIEWS
// ========================================

router.get(
  "/my-interviews",
  protect,
  authorize("STUDENT"),
  getMyInterviews
);

// ========================================
// COMPANY - VIEW ALL MY INTERVIEWS
// ========================================

router.get(
  "/company-interviews",
  protect,
  authorize("COMPANY"),
  getCompanyInterviews
);

// ========================================
// COMPANY - SCHEDULE INTERVIEW
// ========================================

router.post(
  "/schedule/:applicationId",
  protect,
  authorize("COMPANY"),
  scheduleInterview
);

// ========================================
// COMPANY - UPDATE / RESCHEDULE / CANCEL
// ========================================

router.put(
  "/update/:applicationId/:interviewId",
  protect,
  authorize("COMPANY"),
  updateInterview
);

module.exports = router;
