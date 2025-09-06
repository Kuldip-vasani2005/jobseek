import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"], // dropdown options
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["Entry Level", "Mid Level", "Senior Level", "Manager", "Director"], // dropdown options
    },
    position: {
      type: Number,
      required: true,
      min: 1,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

// ✅ Automatically adds createdAt and updatedAt

export const Job = mongoose.model("Job", jobSchema);
export default Job;
