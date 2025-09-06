import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "./utils/contants";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { SendIcon, CheckIcon } from "lucide-react";
import { motion } from "framer-motion";

const getApplicantId = (applicant) => {
  if (!applicant) return null;
  if (typeof applicant === "object") return applicant._id ?? String(applicant);
  return String(applicant);
};

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        const jobData = res.data.job ?? res.data;
        dispatch(setSingleJob(jobData));

        if (typeof res.data.isApplied === "boolean") {
          setIsApplied(res.data.isApplied);
          return;
        }

        const alreadyApplied = Array.isArray(jobData.applications)
          ? jobData.applications.some((application) => {
              const applicantId = getApplicantId(
                application.applicant ??
                  application.applicantId ??
                  application
              );
              return user?._id && String(applicantId) === String(user._id);
            })
          : false;

        setIsApplied(Boolean(alreadyApplied));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job details");
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const applyJobHandler = async () => {
    if (!user) return toast.error("Please login to apply");
    if (user.role === "recruiter")
      return toast.error("Recruiters cannot apply for jobs");
    if (isApplied) return toast.error("You have already applied");

    try {
      setLoading(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Application submitted");
        const updatedJob = {
          ...singleJob,
          applications: [
            ...(singleJob?.applications ?? []),
            {
              applicant: user._id,
              _id: res.data.applicationId ?? Date.now().toString(),
            },
          ],
        };
        dispatch(setSingleJob(updatedJob));
        setIsApplied(true);
      } else {
        toast.error(res.data?.message || "Application failed");
        if (
          res.data?.message &&
          /already applied/i.test(res.data.message)
        )
          setIsApplied(true);
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(errMsg);
      if (errMsg && /already applied/i.test(errMsg)) setIsApplied(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#d0e7ff] to-[#c0f0ff] py-10">
      <motion.div
        className="max-w-4xl mx-auto p-6 rounded-xl bg-white border border-gray-100 shadow-lg
                   hover:scale-105 hover:-rotate-1 hover:shadow-[0_15px_35px_rgba(59,130,246,0.35)]
                   transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="font-bold text-2xl text-gray-800">
              {singleJob?.title || "Job Title"}
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-blue-100 text-blue-700 font-semibold shadow-sm">
                {singleJob?.position || "N/A"} Position
              </Badge>
              <Badge className="bg-red-100 text-red-600 font-semibold shadow-sm">
                {singleJob?.jobType || "N/A"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-700 font-semibold shadow-sm">
                {singleJob?.salary ? `${singleJob.salary} LPA` : "N/A"}
              </Badge>
            </div>
          </div>

          {/* Apply Button Logic */}
          {user?.role === "recruiter" ? (
            <Button
              disabled
              className="rounded-lg px-6 py-2 font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
            >
              Recruiters cannot apply
            </Button>
          ) : (
            <Button
              onClick={applyJobHandler}
              disabled={isApplied || loading}
              className={`rounded-lg px-6 py-2 font-medium transition-all duration-300
                        ${
                          isApplied
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 hover:shadow-lg"
                        }`}
            >
              {isApplied ? (
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" /> Already Applied
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SendIcon className="h-4 w-4" />{" "}
                  {loading ? "Applying..." : "Apply Now"}
                </span>
              )}
            </Button>
          )}
        </div>

        <h2 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
          Job Description
        </h2>

        <div className="space-y-3 my-4 text-gray-800">
          <p>
            <span className="font-bold">Role:</span>{" "}
            {singleJob?.title || "N/A"}
          </p>
          <p>
            <span className="font-bold">Location:</span>{" "}
            {singleJob?.location || "N/A"}
          </p>
          <p>
            <span className="font-bold">Description:</span>{" "}
            {singleJob?.description || "N/A"}
          </p>
          <p>
            <span className="font-bold">Experience Level:</span>{" "}
            {singleJob?.experienceLevel || "N/A"}
          </p>
          <p>
            <span className="font-bold">Salary:</span>{" "}
            {singleJob?.salary ? `${singleJob.salary} LPA` : "N/A"}
          </p>
          <p>
            <span className="font-bold">Total Applicants:</span>{" "}
            {singleJob?.applications?.length || 0}
          </p>
          <p>
            <span className="font-bold">Posted Date:</span>{" "}
            {singleJob?.createdAt
              ? new Date(singleJob.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDescription;
