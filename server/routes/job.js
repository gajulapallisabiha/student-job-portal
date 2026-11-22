
const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  getMyCompanyJobs,
  updateJob,
  deleteJob,
  getSavedJobs,
  saveJob,
  removeSavedJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// STUDENT - SAVED JOBS
router.get("/saved", protect, authorize("STUDENT"), getSavedJobs);
router.post("/:id/save", protect, authorize("STUDENT"), saveJob);
router.delete("/:id/save", protect, authorize("STUDENT"), removeSavedJob);

// COMPANY - JOB MANAGEMENT
router.get("/my-jobs", protect, authorize("COMPANY"), getMyCompanyJobs);
router.post("/", protect, authorize("COMPANY"), createJob);
router.put("/:id", protect, authorize("COMPANY"), updateJob);
router.delete("/:id", protect, authorize("COMPANY"), deleteJob);

// PUBLIC - JOB LISTING
router.get("/", getJobs);
router.get("/:id", getJobById);

module.exports = router;
