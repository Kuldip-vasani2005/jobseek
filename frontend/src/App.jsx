import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import { Toaster } from "sonner";

// Admin components
import Companies from "./components/admin/Companies";
import Adminjobs from "./components/admin/Adminjobs";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminPanel from "./components/admin/Adminpanel";
import AdminpanelLogin from "./components/admin/AdminpanelLogin";
import SavedJobsPage from "./components/savedJobspage";
import EditJob from "./components/admin/EditJob";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/description/:id" element={<JobDescription />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<SavedJobsPage />} />
        <Route path="/adminpanel/jobs/edit/:id" element={<EditJob />} />


        {/* Admin login */}
        <Route path="/adminpanellogin" element={<AdminpanelLogin />} />

        {/* Admin (protected) */}
        <Route
          path="/adminpanel/*"
          element={
            <ProtectedRoute roles={["recruiter", "admin"]}>
              <Routes>
                <Route path="" element={<AdminPanel />} />
                <Route path="companies" element={<Companies />} />
                <Route path="companies/create" element={<CompanyCreate />} />
                <Route path="companies/:id" element={<CompanySetup />} />
                <Route path="jobs" element={<Adminjobs />} />
                <Route path="jobs/post" element={<PostJob />} />
                <Route path="jobs/:id" element={<Adminjobs />} />
                <Route path="jobs/:id/applicants" element={<Applicants />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster position="bottom-right" richColors closeButton duration={1000} />
    </BrowserRouter>
  );
};

export default App;
