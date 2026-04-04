import express from "express";
import { createJob, getJobById, getJobs, updateJob } from "../controllers/jobController.js";
import { protect, recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, recruiterOnly, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, recruiterOnly, updateJob);

export default router;
