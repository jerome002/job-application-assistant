import express from 'express';
import Job from '../models/Job.js'; // Ensure the .js extension is there!

const router = express.Router();

// GET: /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});
export default router;