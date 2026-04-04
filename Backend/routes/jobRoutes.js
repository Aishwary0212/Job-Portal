import express from "express";
import { createJob, deleteJob, getJobById, getJobs, updateJob } from "../controllers/jobController.js";
import { protect, recruiterOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, recruiterOrAdmin, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, recruiterOrAdmin, updateJob);
router.delete("/:id", protect, recruiterOrAdmin, deleteJob);

export default router;
