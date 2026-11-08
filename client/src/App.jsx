
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Jobs from "./pages/Jobs";
import Apply from "./pages/Apply";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";

import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import CompanyJobs from "./pages/CompanyJobs";
import CompanyApplications from "./pages/CompanyApplications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/company-jobs" element={<CompanyJobs />} />

        <Route
          path="/company-jobs/:jobId/applications"
          element={<CompanyApplications />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
