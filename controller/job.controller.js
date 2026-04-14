import Job from "../models/job.model.js";

// GET /api/jobs — get all active jobs
export const getJobs = async (req, res) => {
  try {
    // Include existing jobs that predate the isActive field (isActive missing = treat as active)
    const jobs = await Job.find({ $or: [{ isActive: true }, { isActive: { $exists: false } }] }).sort({ createdAt: -1 });

    // FIX bug #5: was returning 201 (Created) for a GET — now correctly 200 (OK)
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/jobs/all — HR only: get every job (active + inactive)
export const getAllJobsForHR = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/jobs/:id — get a single job by ID (used by ApplyJob to show job title)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/jobs — HR creates a new job posting
export const createJob = async (req, res) => {
  try {
    const { job_title, company, location, jobType, description, requirements } = req.body;

    // Validate required fields
    if (!job_title || !company || !location || !jobType || !description) {
      return res.status(400).json({
        success: false,
        message: "job_title, company, location, jobType, and description are required",
      });
    }

    if (!requirements || requirements.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one requirement/skill is required",
      });
    }

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/jobs/:id/toggle — HR can activate/deactivate a job posting
export const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job ${job.isActive ? "activated" : "deactivated"} successfully`,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
