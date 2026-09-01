const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

// Get all jobs
router.get("/", getJobs);

// Get one job
router.get("/:id", getJobById);

// Create job
router.post("/", createJob);

// Update job
router.put("/:id", updateJob);

// Delete job
router.delete("/:id", deleteJob);

module.exports = router;