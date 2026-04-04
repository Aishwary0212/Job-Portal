import Job from "../models/Job.js";
import Application from "../models/Application.js";

// Create Job (Recruiter)
export const createJob = async (req, res) => {
  try {
    const { title, company, location, description, type, status } = req.body;

    if (!title || !company || !location) {
      return res.status(400).json({ message: "Title, company, and location are required" });
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      type,
      status,
      createdBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationsCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicationsCount
        };
      })
    );

    res.json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicationsCount = await Application.countDocuments({ job: job._id });

    res.json({
      ...job.toObject(),
      applicationsCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "admin" &&
      job.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You can only edit your own jobs" });
    }

    job.title = req.body.title?.trim() || job.title;
    job.company = req.body.company?.trim() || job.company;
    job.location = req.body.location?.trim() || job.location;
    job.description = req.body.description ?? job.description;
    job.type = req.body.type ?? job.type;
    job.status = req.body.status ?? job.status;

    const updatedJob = await job.save();
    const populatedJob = await updatedJob.populate("createdBy", "name email");

    res.json(populatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "admin" &&
      job.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
