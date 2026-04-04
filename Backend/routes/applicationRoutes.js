import express from "express";
import {
  applyToJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", protect, getMyApplications);
router.get("/", protect, adminOnly, getAllApplications);
router.post("/:jobId", protect, applyToJob);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

export default router;
