
const Job = require("../models/Job");
const mongoose = require("mongoose");
const User = require("../models/User");

// GET ALL JOBS
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE JOB
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      salary,
      type,
      jobType,
      deadline,
    } = req.body;

    const selectedType = type || jobType;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !location?.trim() ||
      !selectedType ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Please login again",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "COMPANY") {
      return res.status(403).json({
        success: false,
        message: "Only company accounts can post jobs",
      });
    }

    const jobDeadline = new Date(deadline);

    if (Number.isNaN(jobDeadline.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid application deadline",
      });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company?.trim() || user.name,
      companyId: user._id,
      description: description.trim(),
      location: location.trim(),
      salary: salary?.trim() || "Not specified",
      type: selectedType,
      deadline: jobDeadline,
      skills: [],
      eligibility: "Not specified",
    });

    console.log("JOB CREATED:", job._id);
    console.log("COMPANY ID:", job.companyId);

    res.status(201).json({
      success: true,
      message: "Job posted successfully!",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create job",
    });
  }
};

// GET MY COMPANY JOBS
const getMyCompanyJobs = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Please login again",
      });
    }

    const jobs = await Job.find({
      companyId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get company jobs error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE JOB
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (String(job.companyId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another company's job",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "salary",
      "type",
      "skills",
      "eligibility",
      "deadline",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE JOB
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (String(job.companyId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete another company's job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getMyCompanyJobs,
  updateJob,
  deleteJob,
};
