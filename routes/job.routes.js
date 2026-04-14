import express from "express";
import { getJobs, getAllJobsForHR, getJobById, createJob, toggleJobStatus } from "../controller/job.controller.js";

const JobRouter = express.Router();

JobRouter.get("/", getJobs);             // GET all active jobs (public)
JobRouter.get("/all", getAllJobsForHR);  // GET ALL jobs incl. inactive (HR only)
JobRouter.get("/:id", getJobById);       // GET single job by ID (for ApplyJob page)
JobRouter.post("/", createJob);          // POST create new job (HR panel)
JobRouter.patch("/:id/toggle", toggleJobStatus); // PATCH toggle active/inactive

export default JobRouter;