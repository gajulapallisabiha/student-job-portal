import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";

import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import CompanyJobs from "./pages/CompanyJobs";
import CompanyApplications from "./pages/CompanyApplications";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ================= AUTHENTICATION ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= STUDENT ================= */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />


        {/* ================= COMPANY ================= */}

        <Route
          path="/company-dashboard"
          element={<CompanyDashboard />}
        />

        <Route
          path="/post-job"
          element={<PostJob />}
        />

        <Route
          path="/company-jobs"
          element={<CompanyJobs />}
        />

        <Route
          path="/company-jobs/:jobId/applications"
          element={<CompanyApplications />}
        />


        {/* ================= UNKNOWN URL ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

