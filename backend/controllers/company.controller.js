import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js"; // ✅ use centralized config

// Register company
export const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    // Check if user already has a company with the same name
    const existingCompany = await Company.findOne({ name, userId: req.id });
    if (existingCompany) {
      return res.status(400).json({
        message: "You already have a company with this name.",
        success: false,
      });
    }

    const newCompany = await Company.create({
      name,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company: newCompany,
      success: true,
    });
  } catch (error) {
    console.error("Error registering company:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Get all companies of logged-in user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Companies fetched successfully.",
      companies,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Get single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company fetched successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Update company info
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (location) updateData.location = location;

    // ✅ Handle logo upload
    if (file) {
      const b64 = file.buffer.toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "company_logos",
      });

      updateData.logo = result.secure_url;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};


export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}, "name"); // only name field
    res.status(200).json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch companies", error });
  }
};

// import Company from "../models/company.model.js"; // Adjust path to your model

// DELETE /
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findOne({ _id: id, userId: req.id }); // ensure user owns it
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found or not authorized",
      });
    }

    // Optional: delete jobs related to this company
    // await Job.deleteMany({ company: id });

    await company.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting company",
    });
  }
};
