import express from 'express';
import { getJobs } from '../controllers/jobController.js';

const router = express.Router();

// GET: /api/jobs
// This matches what you use in DashboardPage.jsx: API.get("/jobs")
router.get('/', getJobs);

export default router;