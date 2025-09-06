import Job from "../models/job.model.js";
import Company from "../models/company.model.js";

// 🔹 POST: Create a Job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id; // injected from isAuthenticated middleware

    // validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // ✅ Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    // ✅ Ensure requirements is always array
    const reqArray = Array.isArray(requirements)
      ? requirements
      : requirements.split(",").map((r) => r.trim());

    const job = await Job.create({
      title,
      description,
      requirements: reqArray,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "Job posted successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.error("Post Job Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// 🔹 GET: All Jobs (with search + company info)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company", "name logo location") // ✅ select only required fields
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// 🔹 GET: Job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    const job = await Job.findById(jobId)
      .populate("company", "name logo location")
      .populate({
        path: "applications",
        populate: { path: "applicant", select: "name email" },
      });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found.", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    return res.status(500).json({ message: "Server error.", success: false });
  }
};

// 🔹 GET: Jobs by Admin (Created By Logged-in User)
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId }).populate(
      "company",
      "name logo"
    );

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("Get Admin Jobs Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// 🔹 PUT: Update job
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("company", "name logo");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 🔹 DELETE: Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
