import cron from 'node-cron';
import { fetchTechJobs } from './jobService.js';

const initCrons = (io) => {
  // Use a named function so we can wrap it in a try/catch
  const safeSync = async () => {
    try {
      await fetchTechJobs(io);
    } catch (err) {
      console.error("[CRON ERROR]:", err.message);
    }
  };

  // Run every minute for dev
  cron.schedule('*/1 * * * *', safeSync);

  console.log(' Background Cron Services Initialized');
};

export default initCrons;