import nodeSchedule from 'node-schedule';
import SearchDefinition from '../models/SearchDefinition';
import SearchResult from '../models/SearchResult';
import fetchJobListings from './LinkedInScraper';
import logger from '../utils/logger';

const jobs: { [key: number]: nodeSchedule.Job } = {};

export const scheduleJobForSearch = async (search: SearchDefinition) => {
  if (jobs[search.id]) {
    jobs[search.id].cancel();
  }

  logger.info('Scheduling job for search', { searchId: search.id, refreshInterval: search.refreshInterval });

  const job = nodeSchedule.scheduleJob(`*/${search.refreshInterval} * * * *`, async () => {
    try {
      const jobListings = await fetchJobListings({
        keyword: search.keyword,
        location: search.location,
      });

      logger.info('Fetched job listings', { count: jobListings.length });

      for (const listing of jobListings) {
        try {
          await SearchResult.create({
            searchId: search.id,
            position: listing.position,
            company: listing.company,
            location: listing.location,
            date: listing.date,
            salary: listing.salary, // Assuming you have a salary field in the DB schema
            jobUrl: listing.jobUrl,
          });
          logger.info('Job listing saved', { listing });
        } catch (error) {
          logger.error('Error saving job listing', {
            error: error instanceof Error ? error.message : String(error),
            listing,
          });
        }
      }

      logger.info('Job listings processed', { searchId: search.id, count: jobListings.length });
    } catch (error) {
      logger.error('Error during job execution', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  jobs[search.id] = job;
};

export const startMonitoringAllSearches = async () => {
  try {
    const searches = await SearchDefinition.findAll();
    searches.forEach(scheduleJobForSearch);
    logger.info('Started monitoring all searches');
  } catch (error) {
    logger.error('Error starting monitoring of searches', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const stopJob = (searchId: number) => {
  if (jobs[searchId]) {
    jobs[searchId].cancel();
    delete jobs[searchId];
    logger.info('Stopped job', { searchId });
  }
};
