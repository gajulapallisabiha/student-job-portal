const Application = require("../models/Application");
const Job = require("../models/Job");


// ========================================
// STUDENT - APPLY FOR JOB
// ========================================

const applyForJob = async (req, res) => {
  try {
    const {
      jobId,
      coverLetter,
    } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check whether student already applied
    const existingApplication =
      await Application.findOne({
        job: jobId,
        student: req.user.id,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "You have already applied for this job",
      });
    }

    const application =
      await Application.create({
        job: jobId,
        student: req.user.id,
        coverLetter:
          coverLetter || "",
        status: "Pending",
      });

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error(
      "Apply job error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit application",
      error: error.message,
    });
  }
};


// ========================================
// STUDENT - GET MY APPLICATIONS
// ========================================

const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        student: req.user.id,
      })
        .populate(
          "job",
          "title company location type salary"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error(
      "Get my applications error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch applications",
      error: error.message,
    });
  }
};


// ========================================
// COMPANY - GET APPLICATIONS FOR JOB
// ========================================

const getApplicationsForJob = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        job: req.params.jobId,
      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "job",
          "title company"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error(
      "Get job applications error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch applications",
      error: error.message,
    });
  }
};


// ========================================
// COMPANY - ACCEPT / REJECT
// ========================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (
      status !== "Accepted" &&
      status !== "Rejected"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be Accepted or Rejected",
      });
    }

    const application =
      await Application.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        `Application ${status.toLowerCase()} successfully`,
      application,
    });

  } catch (error) {
    console.error(
      "Update application status error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update application",
      error: error.message,
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};

