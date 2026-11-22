
const Application = require("../models/Application");

// ========================================
// COMPANY - SCHEDULE INTERVIEW
// ========================================

const scheduleInterview = async (req, res) => {
  try {
    const {
      interviewDate,
      interviewMode,
      meetingLink,
      location,
      instructions,
    } = req.body;

    const { applicationId } = req.params;

    if (!interviewDate || !interviewMode) {
      return res.status(400).json({
        success: false,
        message: "Interview date and mode are required",
      });
    }

    if (!["Online", "Offline"].includes(interviewMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview mode",
      });
    }

    const parsedDate = new Date(interviewDate);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid future interview date",
      });
    }

    if (interviewMode === "Online" && !meetingLink?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for online interviews",
      });
    }

    if (interviewMode === "Offline" && !location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Interview location is required for offline interviews",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Verify company ownership using companyId
    if (
      !application.job ||
      application.job.companyId?.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to schedule this interview",
      });
    }

    if (application.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot schedule an interview for a rejected application",
      });
    }

    application.interviews.push({
      scheduledBy: req.user.id,
      interviewDate: parsedDate,
      interviewMode,
      meetingLink:
        interviewMode === "Online" ? meetingLink.trim() : "",
      location:
        interviewMode === "Offline" ? location.trim() : "",
      instructions: instructions?.trim() || "",
      status: "Scheduled",
    });

    await application.save();

    const updatedApplication = await Application.findById(applicationId)
      .populate("student", "name email")
      .populate("job", "title company")
      .populate("interviews.scheduledBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Schedule Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
      error: error.message,
    });
  }
};

// ========================================
// STUDENT - GET MY INTERVIEWS
// ========================================

const getMyInterviews = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
      "interviews.0": { $exists: true },
    })
      .populate("job", "title company location")
      .populate("interviews.scheduledBy", "name email");

    const interviews = applications.flatMap((application) =>
      application.interviews.map((interview) => ({
        _id: interview._id,
        applicationId: application._id,
        job: application.job,
        interviewDate: interview.interviewDate,
        interviewMode: interview.interviewMode,
        meetingLink: interview.meetingLink,
        location: interview.location,
        instructions: interview.instructions,
        status: interview.status,
        scheduledBy: interview.scheduledBy,
        createdAt: interview.createdAt,
      }))
    );

    interviews.sort(
      (a, b) =>
        new Date(a.interviewDate) - new Date(b.interviewDate)
    );

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get Student Interviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
};

// ========================================
// COMPANY - GET MY INTERVIEWS
// ========================================

const getCompanyInterviews = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .populate("job", "title company companyId")
      .populate("interviews.scheduledBy", "name email");

    const interviews = applications
      .filter(
        (application) =>
          application.job &&
          application.job.companyId?.toString() ===
            req.user.id.toString()
      )
      .flatMap((application) =>
        application.interviews.map((interview) => ({
          _id: interview._id,
          applicationId: application._id,
          student: application.student,
          job: application.job,
          interviewDate: interview.interviewDate,
          interviewMode: interview.interviewMode,
          meetingLink: interview.meetingLink,
          location: interview.location,
          instructions: interview.instructions,
          status: interview.status,
          scheduledBy: interview.scheduledBy,
          createdAt: interview.createdAt,
        }))
      );

    interviews.sort(
      (a, b) =>
        new Date(a.interviewDate) - new Date(b.interviewDate)
    );

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get Company Interviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company interviews",
      error: error.message,
    });
  }
};

// ========================================
// COMPANY - UPDATE / RESCHEDULE INTERVIEW
// ========================================

const updateInterview = async (req, res) => {
  try {
    const { applicationId, interviewId } = req.params;

    const {
      interviewDate,
      interviewMode,
      meetingLink,
      location,
      instructions,
      status,
    } = req.body;

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Verify company ownership using companyId
    if (
      !application.job ||
      application.job.companyId?.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this interview",
      });
    }

    const interview = application.interviews.id(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interviewDate !== undefined) {
      const parsedDate = new Date(interviewDate);

      if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid future interview date",
        });
      }

      interview.interviewDate = parsedDate;
    }

    if (interviewMode !== undefined) {
      if (!["Online", "Offline"].includes(interviewMode)) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview mode",
        });
      }

      interview.interviewMode = interviewMode;
    }

    const finalMode = interviewMode || interview.interviewMode;

    if (finalMode === "Online") {
      const finalLink =
        meetingLink !== undefined
          ? meetingLink.trim()
          : interview.meetingLink;

      if (!finalLink) {
        return res.status(400).json({
          success: false,
          message: "Meeting link is required for online interviews",
        });
      }

      interview.meetingLink = finalLink;
      interview.location = "";
    }

    if (finalMode === "Offline") {
      const finalLocation =
        location !== undefined
          ? location.trim()
          : interview.location;

      if (!finalLocation) {
        return res.status(400).json({
          success: false,
          message: "Location is required for offline interviews",
        });
      }

      interview.location = finalLocation;
      interview.meetingLink = "";
    }

    if (instructions !== undefined) {
      interview.instructions = instructions.trim();
    }

    if (status !== undefined) {
      if (
        !["Scheduled", "Completed", "Cancelled"].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview status",
        });
      }

      interview.status = status;
    }

    interview.updatedAt = new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    console.error("Update Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update interview",
      error: error.message,
    });
  }
};

module.exports = {
  scheduleInterview,
  getMyInterviews,
  getCompanyInterviews,
  updateInterview,
};
