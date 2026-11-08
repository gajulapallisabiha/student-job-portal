
const dns = require("node:dns");

// ==========================================
// GOOGLE DNS
// ==========================================

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ==========================================
// IMPORT PACKAGES
// ==========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/job");
const applicationRoutes = require("./routes/application");
const profileRoutes = require("./routes/profileRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Serve uploaded resumes
app.use("/uploads", express.static("uploads"));

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Job Portal Backend is running",
  });
});

// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// Jobs
app.use("/api/jobs", jobRoutes);

// Applications
app.use("/api/applications", applicationRoutes);

// Student Profile
app.use("/api/profile", profileRoutes);

// Resume Upload - NEW FEATURE
app.use("/api/resume", resumeRoutes);

// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(err instanceof require("multer").MulterError ? 400 : 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// ==========================================
// MONGODB CONNECTION
// ==========================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is missing from .env file");
  process.exit(1);
}

// ==========================================
// CONNECT TO MONGODB
// ==========================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  });
