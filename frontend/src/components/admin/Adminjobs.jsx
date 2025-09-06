import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "../../hooks/UseGetAllAdminJobs";
import { setSearchJobByText } from "../../redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs(); // ✅ Fetch all jobs on mount

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Filter jobs with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchJobByText(input));
    }, 300);
    return () => clearTimeout(timer);
  }, [input, dispatch]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌈 Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x blur-3xl opacity-30"></div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto my-10 px-4">
        {/* Search + New Job */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 my-8 p-6 
          bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 
          transform hover:scale-[1.01] transition-all duration-300"
        >
          <Input
            className="w-full md:w-1/2 border border-purple-300/50 bg-white/70 backdrop-blur-md 
            focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-md 
            rounded-xl px-4 py-2 transition duration-300 hover:scale-[1.02]"
            placeholder="🔍 Filter by job title or company"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={() => navigate("/adminpanel/jobs/post")}
            className="px-6 py-2 rounded-xl font-semibold shadow-lg 
            bg-gradient-to-r from-purple-600 to-pink-500 text-white 
            hover:from-pink-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl 
            transition-all duration-300"
          >
            + New Job
          </Button>
        </div>

        {/* Jobs Table */}
        <div
          className="p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 
          transform hover:scale-[1.01] transition duration-300"
        >
          <AdminJobsTable /> {/* ✅ Table auto-updates when Redux changes */}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
