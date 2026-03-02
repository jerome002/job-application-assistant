import cron from "node-cron";
import { fetchTechJobs } from "./jobService.js";
import { runMatchingEngine } from "./matchService.js";

/**
 * Initializes background cron jobs for:
 * 1. Fetching tech jobs
 * 2. Running matching engine
 */
const initCrons = (io) => {
  const safeSync = async () => {
    try {
      console.log("Starting background sync...");

      // Fetch jobs from Adzuna API
      await fetchTechJobs(io);

      // Run the matching engine
      await runMatchingEngine(io);

      console.log("Background sync and matching complete.");
    } catch (err) {
      console.error("[CRON ERROR]:", err.message);
    }
  };

  // Schedule every 5 minutes (*/5 * * * *)
  cron.schedule("*/5 * * * *", safeSync);

  console.log("Cron services initialized (fetch + match).");
};

export default initCrons;