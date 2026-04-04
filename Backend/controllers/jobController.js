import Job from "../models/Job.js";

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

    res.json(jobs);
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

    res.json(job);
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

    if (job.createdBy.toString() !== req.user._id.toString()) {
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
