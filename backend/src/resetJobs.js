// backend/src/resetJobs.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';

dotenv.config({ path: '../.env' }); // Look for .env in the root folder

async function reset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB...");
    
    // Set all jobs back to 'processed: false'
    const result = await Job.updateMany({}, { $set: { processed: false } });
    
    console.log(`♻️ Reset ${result.modifiedCount} jobs. The Matching Engine will now process them again.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Reset failed:", err.message);
    process.exit(1);
  }
}

reset();