import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  location: { type: String, default: "Remote" },
  description: { type: String, required: true },
  salary: { type: String },
  url: { type: String, required: true, unique: true }, // Prevent duplicate listings
  source: { type: String }, // e.g., 'Adzuna', 'LinkedIn'
  type: { type: String },   // 'Full-time', 'Contract'
  skillsRequired: [String], // We will extract these from the description
  postedAt: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false } // For the Matching Engine to track
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);