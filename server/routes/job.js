
const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  getMyCompanyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all jobs (available to everyone)
router.get("/", getJobs);

// Get jobs posted by logged-in company
router.get(
  "/my-jobs",
  protect,
  authorize("COMPANY"),
  getMyCompanyJobs
);

// Get single job
router.get("/:id", getJobById);

// Post a job
router.post(
  "/",
  protect,
  authorize("COMPANY"),
  createJob
);

// Update a job
router.put(
  "/:id",
  protect,
  authorize("COMPANY"),
  updateJob
);

// Delete a job
router.delete(
  "/:id",
  protect,
  authorize("COMPANY"),
  deleteJob
);

module.exports = router;
