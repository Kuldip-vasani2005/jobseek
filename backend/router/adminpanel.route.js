import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminAuth from "../middlewares/adminAuth.js";
import User from "../models/user.model.js";
import {
  getAllUsers,
  getAllJobs,
  getAllCompanies,
  getAllApplications,
  deleteUser,
  deleteJob,
  deleteCompany,
  deleteApplication,
  updateUser,
  updateJob,
  updateCompany,
  updateApplication,
} from "../controllers/adminpanel.controller.js";

const router = express.Router();

// ------------------ Admin / Recruiter Login ------------------
router.post("/adminpanellogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || (user.role !== "recruiter" && user.role !== "admin")) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // ✅ Return user object too (for Redux)
    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ Protected Admin/Recruiter Routes ------------------
router.get("/users", adminAuth(["recruiter", "admin"]), getAllUsers);
router.get("/jobs", adminAuth(["recruiter", "admin"]), getAllJobs);
router.get("/companies", adminAuth(["recruiter", "admin"]), getAllCompanies);
router.get("/applications", adminAuth(["recruiter", "admin"]), getAllApplications);

// Delete
router.delete("/users/:id", adminAuth(["recruiter", "admin"]), deleteUser);
router.delete("/jobs/:id", adminAuth(["recruiter", "admin"]), deleteJob);
router.delete("/companies/:id", adminAuth(["recruiter", "admin"]), deleteCompany);
router.delete("/applications/:id", adminAuth(["recruiter", "admin"]), deleteApplication);

// Update
router.put("/users/:id", adminAuth(["recruiter", "admin"]), updateUser);
router.put("/jobs/:id", adminAuth(["recruiter", "admin"]), updateJob);
router.put("/companies/:id", adminAuth(["recruiter", "admin"]), updateCompany);
router.put("/applications/:id", adminAuth(["recruiter", "admin"]), updateApplication);

// ------------------ Check Auth ------------------
router.get("/checkauth", adminAuth(["recruiter", "admin"]), (req, res) => {
  res.json({
    success: true,
    user: req.user, // comes from adminAuth middleware
  });
});

export default router;
