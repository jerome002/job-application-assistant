import cron from 'node-cron';
import { fetchTechJobs } from './jobService.js';
import { runMatchingEngine } from './matchService.js'; // 1. Import the engine

const initCrons = (io) => {
  const safeSync = async () => {
    try {
      console.log("🚀 Starting Background Sync...");
      // 2. Fetch the jobs first
      await fetchTechJobs(io); 
      
      // 3. Immediately run the engine to match and auto-apply
      await runMatchingEngine(io); 
      
      console.log("✅ Sync and Matching Complete.");
    } catch (err) {
      console.error("[CRON ERROR]:", err.message);
    }
  };

  // Run every 5 minutes (Dev tip: 1 minute might hit API rate limits)
  cron.schedule('*/5 * * * *', safeSync);

  console.log('🤖 Background Cron Services Initialized (Fetch + Match)');
};

export default initCrons;