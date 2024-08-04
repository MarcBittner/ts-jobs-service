// ./services/SearchManager.ts

import nodeSchedule from 'node-schedule';
import SearchDefinition from '../models/SearchDefinition';
import SearchResult from '../models/SearchResult';
import fetchJobListings from './LinkedInService';
import logger from '../utils/logger';

const jobs: { [key: number]: nodeSchedule.Job } = {};

export const scheduleJob = async (search: SearchDefinition) => {
  if (jobs[search.id]) {
    jobs[search.id].cancel();
  }

  logger.info('Scheduling job', { searchId: search.id, refreshInterval: search.refreshInterval });

  const job = nodeSchedule.scheduleJob(`*/${search.refreshInterval} * * * *`, async () => {
    try {
      const jobListings = await fetchJobListings({
        keyword: search.keyword,
        location: search.location,
      });

      for (const listing of jobListings) {
        await SearchResult.create({
          searchId: search.id,
          position: listing.position,
          company: listing.company,
          location: listing.location,
          date: listing.date,
          salary: listing.salary,
          jobUrl: listing.jobUrl,
        });
      }

      logger.info('Job listings fetched and saved', { searchId: search.id });
    } catch (error) {
      logger.error('Error during job execution', { error: (error as Error).message });
    }
  });

  jobs[search.id] = job;
};

export const startMonitoringAllSearches = async () => {
  try {
    const searches = await SearchDefinition.findAll();
    searches.forEach(scheduleJob);
    logger.info('Started monitoring all searches');
  } catch (error) {
    logger.error('Error starting monitoring of searches', { error: (error as Error).message });
  }
};

export const stopJob = (searchId: number) => {
  if (jobs[searchId]) {
    jobs[searchId].cancel();
    delete jobs[searchId];
    logger.info('Stopped job', { searchId });
  }
};
