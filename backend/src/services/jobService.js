import axios from 'axios';
import Job from '../models/Job.js';
import { extractSkills } from '../utils/extractSkills.js';
import { runMatchingEngine } from './matchingEngine.js';

export const fetchTechJobs = async (io) => {
  try {
    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!APP_ID || !APP_KEY) {
      console.error("API keys missing in .env");
      return;
    }

    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=15&what=software%20developer%20AI%20Data%20Engineer&content-type=application/json`;

    console.log("[API] Contacting Adzuna...");
    const response = await axios.get(url);
    const jobs = response.data.results;

    if (!jobs) return;

    for (let job of jobs) {
      // 1. SAFELY extract and clean strings
      // We use a fallback empty string "" so .replace never hits 'undefined'
      const title = String(job.title || "").replace(/<\/?[^>]+(>|$)/g, "");
      const description = String(job.description || "").replace(/<\/?[^>]+(>|$)/g, "");
      const company = job.company?.display_name || "Company Confidential";
      const location = job.location?.display_name || "Remote/USA";

      // 2. Extract skills from the cleaned description
      const skillsRequired = extractSkills(description);

      // 3. Upsert into MongoDB
      await Job.findOneAndUpdate(
        { url: job.redirect_url },
        {
          title,
          company,
          description,
          location,
          skillsRequired,
          postedAt: job.created ? new Date(job.created) : new Date(),
          processed: false
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Successfully processed ${jobs.length} jobs.`);
    await runMatchingEngine(io);
    console.log(`Successfully processed ${jobs.length} jobs.`);
  } catch (err) {
    console.error("Job Fetch Error:", err.message);
  }
};