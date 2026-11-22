
const mongoose = require("mongoose");

// APPLICATION STATUS HISTORY
const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Selected",
        "Rejected",
      ],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: false }
);

// INTERVIEW SCHEMA
const interviewSchema = new mongoose.Schema(
  {
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    interviewMode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },

    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// MAIN APPLICATION SCHEMA
const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },

    // Uploaded PDF resume
    resumeUrl: {
      type: String,
      default: "",
    },

    // APPLICATION STATUS
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    // APPLICATION STATUS TIMELINE
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },

    // INTERVIEW SCHEDULING
    interviews: {
      type: [interviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// PREVENT DUPLICATE APPLICATIONS
applicationSchema.index(
  { student: 1, job: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);
