import axios from 'axios';
import Job from '../models/Job.js';
import { extractSkills } from '../utils/extractSkills.js';
import { runMatchingEngine } from './matchService.js';

export const fetchTechJobs = async (io) => {
  try {
    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!APP_ID || !APP_KEY) return console.error("API keys missing");

    // Fetching Software/AI/Data roles
    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20&what=software%20developer%20AI%20Data&content-type=application/json`;

    const response = await axios.get(url);
    const jobs = response.data.results;

    if (!jobs) return;

    for (let job of jobs) {
      // Remove HTML tags from Adzuna's strings
      const title = String(job.title || "").replace(/<\/?[^>]+(>|$)/g, "");
      const description = String(job.description || "").replace(/<\/?[^>]+(>|$)/g, "");
      
      const skillsRequired = extractSkills(description);

      await Job.findOneAndUpdate(
        { url: job.redirect_url }, // Unique identifier
        {
          title,
          company: job.company?.display_name || "Company Confidential",
          description,
          location: job.location?.display_name || "Remote",
          url: job.redirect_url,
          salary: job.salary_min ? `$${job.salary_min} - $${job.salary_max}` : "Competitive",
          skillsRequired,
          source: 'Adzuna',
          processed: false
        },
        { upsert: true, new: true }
      );
    }

    console.log(`Jobs Synced. Running Match Engine...`);
    await runMatchingEngine(io);
    
  } catch (err) {
    console.error("Adzuna Service Error:", err.message);
  }
};