import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveJob, removeSavedJob } from "../redux/jobSlice";
import { toast } from "sonner"; // ✅ import toast

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);

  // ✅ check if already saved
  const isSaved = savedJobs.some((j) => j._id === job._id);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    return Math.floor(timeDifference / millisecondsInADay);
  };

  const handleSave = () => {
    if (isSaved) {
      dispatch(removeSavedJob(job._id));
      toast.error("❌ Job removed from saved list"); // ✅ alert when removed
    } else {
      dispatch(saveJob(job));
      toast.success("✅ Job saved successfully!"); // ✅ alert when saved
    }
  };

  return (
    <div
      className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 
      shadow-md transition-all duration-300 transform 
      hover:-translate-y-2 hover:scale-105 hover:shadow-2xl 
      hover:border-blue-400 hover:from-blue-50 hover:to-purple-50"
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button
          variant={isSaved ? "default" : "outline"}
          className="rounded-full"
          size="icon"
          onClick={handleSave}
        >
          <Bookmark className={isSaved ? "text-blue-600 fill-blue-600" : ""} />
        </Button>
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
            ₹{(job.salary / 100000).toFixed(1)} LPA
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
          onClick={handleSave}
          className={`shadow-md ${
            isSaved
              ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
          }`}
        >
          {isSaved ? "Saved" : "Save For Later"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
