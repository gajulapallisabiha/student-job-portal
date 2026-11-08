
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

// ========================================
// HELPER - CHECK COMPANY JOB OWNERSHIP
// ========================================

const companyOwnsJob = (job, company) => {
  if (!job || !company) {
    return false;
  }

  // Prefer company ID verification
  if (job.companyId) {
    return (
      job.companyId.toString() === company._id.toString()
    );
  }

  // Fallback for older jobs without companyId
  return (
    String(job.company || "").trim().toLowerCase() ===
    String(company.name || "").trim().toLowerCase()
  );
};

// ========================================
// STUDENT - APPLY FOR JOB
// ========================================

const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Validate Job ID
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Valid Job ID is required",
      });
    }

    // Validate Cover Letter
    if (!coverLetter || !coverLetter.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cover letter is required",
      });
    }

    // Validate Resume
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your PDF resume",
      });
    }

    // Check whether job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      student: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Save resume URL
    const resumeUrl = `/uploads/${req.file.filename}`;

    // Create application
    const application = await Application.create({
      job: jobId,
      student: req.user.id,
      coverLetter: coverLetter.trim(),
      resumeUrl,
      status: "Applied",
      statusHistory: [
        {
          status: "Applied",
          changedBy: req.user.id,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error("Apply job error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

// ========================================
// STUDENT - GET MY APPLICATIONS
// ========================================

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
    })
      .populate("job", "title company location type salary")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// ========================================
// COMPANY - GET APPLICATIONS FOR OWN JOB
// ========================================

const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID",
      });
    }

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Find logged-in company
    const company = await User.findById(req.user.id);

    // Verify ownership
    if (!companyOwnsJob(job, company)) {
      return res.status(403).json({
        success: false,
        message: "You cannot view applications for this job",
      });
    }

    // Get applicants
    const applications = await Application.find({
      job: jobId,
    })
      .populate("student", "name email")
      .populate("job", "title company companyId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Get job applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// ========================================
// COMPANY - UPDATE APPLICATION STATUS
// ========================================

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Under Review",
      "Shortlisted",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // Validate Application ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID",
      });
    }

    // Find application and associated job
    const application = await Application.findById(
      req.params.id
    ).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Find logged-in company
    const company = await User.findById(req.user.id);

    // Verify job ownership
    if (!companyOwnsJob(application.job, company)) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this application",
      });
    }

    // Update status
    application.status = status;

    application.statusHistory.push({
      status,
      changedBy: req.user.id,
      changedAt: new Date(),
    });

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });

  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
