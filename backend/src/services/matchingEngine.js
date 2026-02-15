import User from '../models/User.js';
import Job from '../models/Job.js';
import Match from '../models/Match.js';

export const runMatchingEngine = async (io) => {
  try {
    console.log("Matching Engine: Analyzing new jobs...");

    // 1. Get all users who have skills listed
    const users = await User.find({ "profile.skills": { $exists: true, $not: { $size: 0 } } });
    
    // 2. Get jobs that are NOT processed yet
    const freshJobs = await Job.find({ processed: false });

    if (freshJobs.length === 0) {
      console.log("Matching Engine: No new jobs to analyze.");
      return;
    }

    for (const job of freshJobs) {
      for (const user of users) {
        // Normalize for comparison
        const userSkills = user.profile.skills.map(s => s.toLowerCase());
        const jobSkills = job.skillsRequired.map(s => s.toLowerCase());

        // Find common skills
        const common = jobSkills.filter(skill => userSkills.includes(skill));
        
        // Calculate % (How many of the job's requirements do I have?)
        const score = jobSkills.length > 0 
          ? Math.round((common.length / jobSkills.length) * 100) 
          : 0;

        // 3. Threshold: Save if match is 30% or higher
        if (score >= 30) {
          const newMatch = await Match.findOneAndUpdate(
            { user: user._id, job: job._id },
            { score: score },
            { upsert: true, new: true }
          ).populate('job');

          console.log(`Match! User ${user.email} matches ${job.title} (${score}%)`);

          // 4. REAL-TIME EMIT
          if (io) {
            io.to(user._id.toString()).emit("new_match", {
              message: `New Match: ${job.title}`,
              score: score,
              job: newMatch.job
            });
          }
        }
      }
      // Mark as processed so we don't repeat this for this job
      job.processed = true;
      await job.save();
    }
  } catch (err) {
    console.error("Matching Error:", err.message);
  }
};