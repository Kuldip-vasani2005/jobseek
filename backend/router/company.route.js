import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { 
  getAllCompanies,
  getCompany, 
  getCompanyById, 
  registerCompany, 
  updateCompany,
  deleteCompany // ✅ import delete
} from "../controllers/company.controller.js";

const router = express.Router();

// ✅ Register a new company (authenticated)
router.route("/register").post(isAuthenticated, registerCompany);

// ✅ Get all companies of logged-in user
router.route("/get").get(isAuthenticated, getCompany);

// ✅ Get single company by ID
router.route("/getcompany/:id").get(isAuthenticated, getCompanyById);

// ✅ Update company info with optional logo upload
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

// ✅ Get all companies (for dropdowns, public)
router.get("/getallcompanies", getAllCompanies);

// ✅ Delete company (authenticated)
router.delete("/delete/:id", isAuthenticated, deleteCompany);

export default router;
