import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "../utils/contants";
import { motion } from "framer-motion";

const EditJob = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    experience: "",
    skills: "",
    companyId: "",
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setCompanyLoading(true);
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/getallcompanies`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) setCompanies(res.data.companies || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        toast.error("Failed to load companies");
      } finally {
        setCompanyLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const job = res.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            location: job.location || "",
            salary: job.salary || "",
            experience: job.experienceLevel || "",
            skills: job.requirements?.join(", ") || "",
            companyId: job.company?._id || "",
          });
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        toast.error("Failed to load job details");
      }
    };
    fetchJob();
  }, [params.id]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value });
    if (errors.companyId) setErrors({ ...errors, companyId: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!input.title.trim()) newErrors.title = "Job title is required";
    if (!input.description.trim())
      newErrors.description = "Description is required";
    if (!input.location.trim()) newErrors.location = "Location is required";
    if (!input.salary) newErrors.salary = "Salary is required";
    if (!input.experience.trim())
      newErrors.experience = "Experience is required";
    if (!input.skills.trim()) newErrors.skills = "Skills are required";
    if (!input.companyId) newErrors.companyId = "Please select a company";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: input.title.trim(),
        description: input.description.trim(),
        location: input.location.trim(),
        salary: Number(input.salary),
        experienceLevel: input.experience.trim(),
        requirements: input.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        company: input.companyId,
      };

      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${params.id}`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Job updated successfully");
        navigate("/adminpanel/jobs");
      }
    } catch (err) {
      console.error("Error updating job:", err);
      toast.error(err.response?.data?.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center w-screen my-10 px-4">
        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.02,
            rotateX: 3,
            rotateY: -3,
            boxShadow:
              "0px 20px 40px rgba(0,0,0,0.15), 0px 10px 20px rgba(147,51,234,0.25)",
          }}
          className="relative w-full max-w-3xl 
                     bg-white/70 backdrop-blur-xl 
                     border border-purple-200/50 
                     shadow-2xl rounded-3xl p-8 space-y-6
                     transition-all duration-500"
        >
          {/* glowing background layer */}
          <div
            className="absolute inset-0 rounded-3xl 
                          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                          opacity-10 blur-2xl -z-10"
          ></div>

          <h1
            className="text-4xl font-extrabold text-center 
                         bg-gradient-to-r from-purple-600 to-pink-500 
                         bg-clip-text text-transparent drop-shadow-lg"
          >
            ✏️ Edit Job
          </h1>

          {/* Job Title */}
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              placeholder="Enter job title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              placeholder="Enter job description"
              rows={4}
              className={`w-full border rounded-xl p-3 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Location *</Label>
              <Input
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Bangalore"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
            </div>
            <div>
              <Label>Salary *</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="6"
                className={errors.salary ? "border-red-500" : ""}
              />
              {errors.salary && (
                <p className="text-red-500 text-sm">{errors.salary}</p>
              )}
            </div>
          </div>

          {/* Experience & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Experience *</Label>
              <Input
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="e.g. 2-4 years"
                className={errors.experience ? "border-red-500" : ""}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience}</p>
              )}
            </div>
            <div>
              <Label>Skills (comma separated) *</Label>
              <Input
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="React, Node.js, MongoDB"
                className={errors.skills ? "border-red-500" : ""}
              />
              {errors.skills && (
                <p className="text-red-500 text-sm">{errors.skills}</p>
              )}
            </div>
          </div>

          {/* Company Select */}
          <div>
            <Label>Company *</Label>
            {companyLoading ? (
              <p className="animate-pulse text-gray-500">
                Loading companies...
              </p>
            ) : companies.length > 0 ? (
              <Select
                value={input.companyId}
                onValueChange={selectChangeHandler}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-red-500">
                No companies found. Please register one first.
              </p>
            )}
            {errors.companyId && (
              <p className="text-red-500 text-sm">{errors.companyId}</p>
            )}
          </div>

          {/* Submit */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={loading || companyLoading || companies.length === 0}
              className="w-full py-3 rounded-2xl font-semibold text-lg 
                         text-white bg-gradient-to-r from-purple-500 to-pink-500 
                         shadow-lg shadow-pink-300/40"
            >
              {loading ? "Updating..." : "Update Job"}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditJob;
