import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// --------------------- JOB ROUTES ---------------------

// Create a new job (protected)
router.post("/post", isAuthenticated, postJob);

// Get all jobs (public)
router.get("/get", getAllJobs);

// Get a single job by ID (public)
router.get("/get/:id", getJobById);

// Get all jobs for admin (protected)
router.get("/admin/jobs", isAuthenticated, getAdminJobs);

// Update a job by ID (protected)
router.put("/update/:id", isAuthenticated, updateJob);

// Delete a job by ID (protected)
router.delete("/delete/:id", isAuthenticated, deleteJob);

export default router;
