const Job = require("../models/Job");

// ==========================================
// GET ALL JOBS
// ==========================================

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};


// ==========================================
// GET SINGLE JOB
// ==========================================

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};


// ==========================================
// CREATE JOB
// ==========================================

const createJob = async (req, res) => {
  try {
    console.log("CREATE JOB BODY:", req.body);

    const {
      title,
      description,
      location,
      salary,
      jobType,
    } = req.body;

    // Required fields from the Post Job form
    if (
      !title ||
      !description ||
      !location ||
      !jobType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Company name
    // We use the logged-in user's name if available.
    const companyName =
      req.user?.name || "Company";

    // Create a default deadline 30 days from today
    const deadline = new Date();

    deadline.setDate(
      deadline.getDate() + 30
    );

    const job = await Job.create({
      title: title.trim(),

      company: companyName,

      description: description.trim(),

      location: location.trim(),

      type: jobType,

      salary:
        salary && salary.trim()
          ? salary.trim()
          : "Not specified",

      skills: [],

      eligibility: "Not specified",

      deadline: deadline,
    });

    console.log(
      "JOB CREATED:",
      job
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });

  } catch (error) {
    console.error(
      "Create job error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE JOB
// ==========================================

const updateJob = async (req, res) => {
  try {
    const job =
      await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });

  } catch (error) {
    console.error(
      "Update job error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};


// ==========================================
// DELETE JOB
// ==========================================

const deleteJob = async (req, res) => {
  try {
    const job =
      await Job.findByIdAndDelete(
        req.params.id
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete job error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};


module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};

