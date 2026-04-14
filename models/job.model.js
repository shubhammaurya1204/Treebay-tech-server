import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    job_title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    // NEW: Department field for HR panel
    department: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    salary: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
    },
    // NEW: Last date to apply — shown to applicants on the job detail card
    lastDateToApply: {
      type: Date,
    },
    // NEW: HR can deactivate a posting without deleting it
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;