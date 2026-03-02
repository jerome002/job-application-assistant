import Application from "../models/Application.js";

/**
 * Auto-applies user to a job if not already applied.
 * @param {String} userId - MongoDB ObjectId of user
 * @param {String} jobId - MongoDB ObjectId of job
 */
export const autoApply = async (userId, jobId) => {
  try {
    const existingApp = await Application.findOne({ user: userId, job: jobId });
    if (existingApp) {
      console.log(`User ${userId} already applied to job ${jobId}`);
      return;
    }

    const newApplication = await Application.create({
      user: userId,
      job: jobId,
      status: "applied",
      appliedDate: new Date(),
      notes: "Applied automatically by AI Assistant (Auto-Apply Service)"
    });

    console.log(`Auto-applied: User ${userId} -> Job ${jobId}`);
    return newApplication;
  } catch (err) {
    console.error(" Auto-Apply Service Error:", err.message);
  }
};