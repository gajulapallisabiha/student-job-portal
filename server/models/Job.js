const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
      required: true,
    },

    salary: {
      type: String,
      default: "Not specified",
    },

    skills: {
      type: [String],
      default: [],
    },

    eligibility: {
      type: String,
      default: "Not specified",
    },

    deadline: {
      type: Date,
      required: true,
    },

    postedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);

