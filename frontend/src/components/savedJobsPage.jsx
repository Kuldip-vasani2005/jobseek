// src/components/SavedJobsPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeSavedJob } from "../redux/jobSlice";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // ✅ import toast

const SavedJobsPage = () => {
  const { savedJobs } = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    return Math.floor(timeDifference / millisecondsInADay);
  };

  if (savedJobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <p className="text-center text-gray-600 text-lg font-medium">
          No jobs saved yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-4">
      {/* ✅ Added job count */}
      <h1 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-500 to-purple-700 bg-clip-text text-transparent drop-shadow-md">
        💾 Saved Jobs ({savedJobs.length})
      </h1>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <div
            key={job._id}
            className="p-5 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200 
            shadow-md transition-all duration-300 transform 
            hover:-translate-y-2 hover:scale-105 hover:shadow-2xl 
            hover:border-blue-400"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {daysAgoFunction(job?.createdAt) === 0
                  ? "Today"
                  : `${daysAgoFunction(job?.createdAt)} days ago`}
              </p>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-3 my-3">
              <div className="p-3 rounded-full bg-white shadow-sm border border-gray-100">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      job?.company?.logo ||
                      "https://img.freepik.com/free-vector/colorful-letter-gradient-logo-design_474888-2309.jpg"
                    }
                    alt="Company Logo"
                  />
                </Avatar>
              </div>
              <div>
                <h1 className="font-semibold text-lg text-gray-800">
                  {job?.company?.name || "Unknown Company"}
                </h1>
                <p className="text-sm text-gray-500">{job?.location || "India"}</p>
              </div>
            </div>

            {/* Job Title & Description */}
            <h1 className="font-bold text-xl text-gray-900 my-2">
              {job?.title || "Job Title"}
            </h1>
            <p className="text-sm text-gray-600 line-clamp-3">
              {job?.description || "No job description provided."}
            </p>

            {/* Tags */}
            <div className="flex items-center flex-wrap gap-2 mt-4">
              <Badge className="text-blue-700 font-bold border border-blue-200 bg-blue-50">
                {job?.position || 1} Position{job?.position > 1 ? "s" : ""}
              </Badge>
              <Badge className="text-[#F83002] font-bold border border-red-200 bg-red-50">
                {job?.jobType || "Full Time"}
              </Badge>
              {job?.salary && (
                <Badge className="text-[#7209b7] font-bold border border-purple-200 bg-purple-50">
                  {job.salary.toLocaleString("en-IN")} LPA
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-5">
              <Button
                onClick={() => navigate(`/description/${job?._id}`)}
                variant="outline"
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                Details
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  dispatch(removeSavedJob(job._id));
                  toast.error("❌ Job removed from saved list");
                }}
                className="shadow-md"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobsPage;
