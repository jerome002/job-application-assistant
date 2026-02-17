import User from '../models/User.js';
import Job from '../models/Job.js';
import Match from '../models/Match.js';
import Application from '../models/Application.js'; // Ensure you have an Application model

export const runMatchingEngine = async (io) => {
  try {
    console.log("🤖 Matching Engine: Analyzing new jobs...");

    const users = await User.find({ "profile.skills": { $exists: true, $not: { $size: 0 } } });
    const freshJobs = await Job.find({ processed: false });

    if (freshJobs.length === 0) return;

    for (const job of freshJobs) {
      for (const user of users) {
        const userSkills = (user.profile.skills || []).map(s => s.toLowerCase());
        const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());

        const common = jobSkills.filter(skill => userSkills.includes(skill));
        const score = jobSkills.length > 0 ? Math.round((common.length / jobSkills.length) * 100) : 0;

        if (score >= 30) {
          const newMatch = await Match.findOneAndUpdate(
            { user: user._id, job: job._id },
            { score: score },
            { upsert: true, new: true }
          ).populate('job');

          console.log(`✨ Match! ${user.email} -> ${job.title} (${score}%)`);

          // --- AUTO-APPLY LOGIC ---
          if (score >= 80 && user.profile?.settings?.autoApply) {
            const alreadyApplied = await Application.findOne({ user: user._id, job: job._id });
            
            if (!alreadyApplied) {
              await Application.create({
                user: user._id,
                job: job._id,
                status: 'applied',
                appliedDate: new Date(),
                notes: "Applied automatically by AI Assistant (High Match Score)."
              });
              console.log(`🚀 AUTO-APPLIED: Submitted ${user.email} for ${job.title}`);
            }
          }

          if (io) {
            io.to(user._id.toString()).emit("new_match", {
              message: `New Match: ${job.title}`,
              score: score
            });
          }
        }
      }
      job.processed = true;
      await job.save();
    }
  } catch (err) {
    console.error("❌ Matching Error:", err.message);
  }
};