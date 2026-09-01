const dns = require("node:dns");

// ==========================================
// GOOGLE DNS
// ==========================================

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);


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


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

// Allow Vite frontend on 5173, 5174 or 5175
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

// Read JSON request body
app.use(express.json());


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
app.use(
  "/api/auth",
  authRoutes
);

// Jobs
app.use(
  "/api/jobs",
  jobRoutes
);

// Applications
app.use(
  "/api/applications",
  applicationRoutes
);


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
// MONGODB CONNECTION
// ==========================================

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;


// ==========================================
// CHECK MONGODB URI
// ==========================================

if (!MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI is missing from .env file"
  );

  process.exit(1);
}


// ==========================================
// CONNECT TO MONGODB
// ==========================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    // Start server only after MongoDB connects
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(
      error.message
    );

    process.exit(1);
  });

