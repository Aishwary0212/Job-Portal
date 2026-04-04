import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["candidate", "recruiter", "admin"],
    default: "candidate"
  },
  location: {
    type: String,
    default: ""
  },
  resumeLink: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
