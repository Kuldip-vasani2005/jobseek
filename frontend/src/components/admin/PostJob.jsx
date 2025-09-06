import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "../utils/contants";

const PostJob = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const jobTypes = [
    "Full-Time",
    "Part-Time",
    "Contract",
    "Internship",
    "Remote",
  ];
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Manager",
    "Director",
  ];

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/getallcompanies`,
          {
            withCredentials: true,
          }
        );
        setCompanies(
          Array.isArray(res.data?.companies) ? res.data.companies : []
        );
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies");
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.companyId) return toast.error("Please select a company");

    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/post`,
        { ...formData },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job posted successfully!");
        setFormData({
          title: "",
          description: "",
          requirements: "",
          salary: "",
          location: "",
          jobType: "",
          experience: "",
          position: "",
          companyId: "",
        });
        setTimeout(() => {
          navigate("/adminpanel/jobs");
        }, 300);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.02,
          rotateX: 3,
          rotateY: -3,
          boxShadow:
            "0px 20px 40px rgba(0,0,0,0.15), 0px 10px 20px rgba(99,102,241,0.25)",
        }}
        className="relative max-w-3xl mx-auto mt-10 
             bg-white p-10 rounded-3xl 
             shadow-2xl shadow-indigo-200/50 
             border border-indigo-100 
             transition-all duration-500"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 blur-2xl -z-10"></div>

        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          Post a New Job
        </h2>

        <form onSubmit={submitHandler} className="grid gap-6">
          {/* Job Title */}
          <div>
            <Label className="text-lg font-semibold">Job Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter job title"
              required
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-lg font-semibold">Description</Label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter job description"
              required
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Requirements */}
          <div>
            <Label className="text-lg font-semibold">
              Requirements (comma-separated)
            </Label>
            <Input
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB"
              required
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Salary */}
          <div>
            <Label className="text-lg font-semibold">Salary</Label>
            <Input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter salary"
              required
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Location */}
          <div>
            <Label className="text-lg font-semibold">Location</Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter job location"
              required
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Job Type Dropdown */}
          <div>
            <Label className="text-lg font-semibold">Job Type</Label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Job Type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Dropdown */}
          <div>
            <Label className="text-lg font-semibold">Experience Level</Label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Experience Level</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Positions */}
          <div>
            <Label className="text-lg font-semibold">Number of Positions</Label>
            <Input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. 3"
              required
              className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Company Dropdown */}
          <div>
            <Label className="text-lg font-semibold">Company</Label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl py-3 font-bold shadow-md"
            >
              Post Job
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
