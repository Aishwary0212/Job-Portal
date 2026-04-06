import Application from "../models/Application.js";
import Job from "../models/Job.js";

const applicationPopulation = [
  { path: "job", populate: { path: "createdBy", select: "name email role" } },
  { path: "candidate", select: "name email location resumeLink gender role" },
  { path: "recruiter", select: "name email role" }
];

export const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply to jobs" });
    }

    const job = await Job.findById(req.params.jobId).populate("createdBy", "name email role");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if ((job.status || "Open") !== "Open") {
      return res.status(400).json({ message: "You can only apply to open jobs" });
    }

    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      recruiter: job.createdBy._id
    });

    const populatedApplication = await Application.findById(application._id).populate(applicationPopulation);

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const query = req.user.role === "candidate"
      ? { candidate: req.user._id }
      : req.user.role === "recruiter"
        ? { recruiter: req.user._id }
        : {};

    const applications = await Application.find(query)
      .populate(applicationPopulation)
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate(applicationPopulation)
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      req.user.role === "recruiter" &&
      application.recruiter.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You can only manage applications for your own jobs" });
    }

    application.status = status;
    await application.save();

    const populatedApplication = await Application.findById(application._id).populate(applicationPopulation);

    res.json(populatedApplication);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
