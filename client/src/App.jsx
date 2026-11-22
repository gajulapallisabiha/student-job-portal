
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";

// EXISTING PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import Apply from "./pages/Apply";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import StudentDashboard from "./pages/StudentDashboard";

// COMPANY PAGES
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import CompanyJobs from "./pages/CompanyJobs";
import CompanyApplications from "./pages/CompanyApplications";

// INTERVIEW PAGES
import StudentInterviews from "./pages/StudentInterviews";
import CompanyInterviews from "./pages/CompanyInterviews";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* GENERAL ROUTES */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT ROUTES */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* STUDENT INTERVIEWS */}
        <Route
          path="/my-interviews"
          element={<StudentInterviews />}
        />

        {/* COMPANY ROUTES */}
        <Route
          path="/company-dashboard"
          element={<CompanyDashboard />}
        />

        <Route path="/post-job" element={<PostJob />} />

        <Route path="/company-jobs" element={<CompanyJobs />} />

        <Route
          path="/company-jobs/:jobId/applications"
          element={<CompanyApplications />}
        />

        {/* COMPANY INTERVIEWS */}
        <Route
          path="/company-interviews"
          element={<CompanyInterviews />}
        />

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
