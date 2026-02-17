console.log("🚀 Seeder script is starting..."); // If you don't see this, the file isn't running

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';

// If running from inside 'src', .env is one level up
dotenv.config({ path: '../.env' }); 

const seedDB = async () => {
  try {
    console.log("🔗 Attempting to connect to MongoDB...");
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env path!");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected.");

    const sampleJobs = [
      {
        title: "Frontend Developer",
        company: "TechFlow",
        location: "Remote",
        url: "https://techflow.example.com/jobs/1",
        skillsRequired: ["React", "JavaScript", "CSS"],
        description: "Build modern UIs with React.",
        processed: false
      },
      {
        title: "Full Stack Engineer",
        company: "DevSync",
        location: "New York, NY",
        url: "https://devsync.example.com/jobs/2",
        skillsRequired: ["React", "Node.js", "MongoDB"],
        description: "Work on both ends of the stack.",
        processed: false
      }
    ];

    console.log("🌱 Inserting jobs...");
    await Job.insertMany(sampleJobs);
    console.log("🎉 SUCCESS: Jobs seeded successfully!");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  }
};

seedDB();