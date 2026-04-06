import express from "express";
import {
  applyToJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { adminOnly, protect, recruiterOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", protect, getMyApplications);
router.get("/", protect, adminOnly, getAllApplications);
router.post("/:jobId", protect, applyToJob);
router.put("/:id/status", protect, recruiterOrAdmin, updateApplicationStatus);

export default router;
