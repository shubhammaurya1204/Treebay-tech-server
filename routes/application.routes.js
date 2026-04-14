import express from "express";
import {
  createApplicant,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../controller/applicant.controller.js";

const ApplicationRouter = express.Router();

// POST /api/applications  OR  /api/applications/apply — both work (fixes URL mismatch bug)
ApplicationRouter.post("/", createApplicant);
ApplicationRouter.post("/apply", createApplicant);

// GET /api/applications?jobId=... — HR views all applications (optionally filtered)
ApplicationRouter.get("/", getApplications);

// GET /api/applications/:id — HR views full application detail
ApplicationRouter.get("/:id", getApplicationById);

// PATCH /api/applications/:id/status — HR updates application status
ApplicationRouter.patch("/:id/status", updateApplicationStatus);

export default ApplicationRouter;
