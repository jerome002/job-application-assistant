import User from "../models/User.js";
import Job from "../models/Job.js";
import Match from "../models/Match.js";
import Application from "../models/Application.js";

export const runMatchingEngine = async (io) => {
  try {
    const users = await User.find({ "profile.skills": { $exists: true, $not: { $size: 0 } } });
    const jobs = await Job.find({ processed: false });

    for (const job of jobs) {
      for (const user of users) {
        const userSkills = (user.profile.skills || []).map(s => s.toLowerCase());
        const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());

        const common = jobSkills.filter(skill => userSkills.includes(skill));
        const score = jobSkills.length ? Math.round((common.length / jobSkills.length) * 100) : 0;

        if (score >= 30) {
          const newMatch = await Match.findOneAndUpdate(
            { user: user._id, job: job._id },
            { score },
            { upsert: true, new: true }
          ).populate("job");

          console.log(`Match: ${user.email} -> ${job.title} (${score}%)`);

          if (score >= 80 && user.profile?.settings?.autoApply) {
            const existingApp = await Application.findOne({ user: user._id, job: job._id });
            if (!existingApp) {
              await Application.create({
                user: user._id,
                job: job._id,
                status: "applied",
                appliedDate: new Date(),
                notes: "Applied automatically by AI Assistant"
              });
              console.log(`Auto-applied: ${user.email} -> ${job.title}`);
            }
          }

          if (io) {
            io.to(user._id.toString()).emit("new_match", { message: `New Match: ${job.title}`, score });
          }
        }
      }
      job.processed = true;
      await job.save();
    }
  } catch (err) {
    console.error("Matching Engine Error:", err.message);
  }
};