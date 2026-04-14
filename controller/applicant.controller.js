import Applicant from "../models/applicant.modal.js";

// POST /api/applications or /api/applications/apply — applicant submits a form
export const createApplicant = async (req, res) => {
  try {
    const {
      jobId,
      personalDetails,
      academics,
      isFresher,
      experiences,
      skills,
      projects,
      documents,
      otherDetails,
      declaration,
    } = req.body;

    // 🔴 Basic Validations
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!personalDetails?.fullName || !personalDetails?.email || !personalDetails?.mobile) {
      return res.status(400).json({
        success: false,
        message: "Personal details (name, email, mobile) are required",
      });
    }

    if (!documents?.resume) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    if (!declaration?.isTrue) {
      return res.status(400).json({
        success: false,
        message: "Declaration must be accepted",
      });
    }

    // 🧠 Calculate Completion Percentage
    let completionPercentage = 0;
    if (personalDetails) completionPercentage += 20;
    if (academics?.length) completionPercentage += 20;
    if (skills?.technical?.length) completionPercentage += 15;
    if (projects?.length) completionPercentage += 15;
    if (documents?.resume) completionPercentage += 20;
    if (declaration?.isTrue) completionPercentage += 10;

    // 🚀 Create Applicant
    const applicant = await Applicant.create({
      jobId,
      personalDetails,
      academics,
      isFresher,
      experiences: isFresher ? [] : experiences,
      skills,
      projects,
      documents,
      otherDetails,
      declaration: {
        ...declaration,
        submittedAt: new Date(),
      },
      completionPercentage,
      applicationStatus: "Submitted",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: applicant,
    });
  } catch (error) {
    console.error(error);

    // 🔥 Handle duplicate application (same email + jobId)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this position with this email address.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/applications — HR fetches all applications (optional ?jobId= filter)
export const getApplications = async (req, res) => {
  try {
    const { jobId } = req.query;

    // Build filter: if jobId is provided, scope to that job
    const filter = jobId ? { jobId } : {};

    const applications = await Applicant.find(filter)
      .populate("jobId", "job_title department location jobType") // attach job info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/applications/:id — HR fetches full details of one application
export const getApplicationById = async (req, res) => {
  try {
    const application = await Applicant.findById(req.params.id).populate(
      "jobId",
      "job_title department location jobType company"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/applications/:id/status — HR updates application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Draft", "Submitted", "Under Review", "Rejected", "Selected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Applicant.findByIdAndUpdate(
      req.params.id,
      { applicationStatus: status },
      { new: true } // return the updated document
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to "${status}"`,
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};