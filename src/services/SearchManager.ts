// src/services/SearchManager.ts

import nodeSchedule from 'node-schedule';
import SearchDefinition from '../models/SearchDefinition';
import SearchResult from '../models/SearchResult';
import fetchJobListings from './LinkedInService';



const jobs: { [key: number]: nodeSchedule.Job } = {};

export const scheduleJob = async (search: SearchDefinition) => {
  if (jobs[search.id]) {
    jobs[search.id].cancel();
  }

  const job = nodeSchedule.scheduleJob(`*/${search.refreshInterval} * * * *`, async () => {
    const jobListings = await fetchJobListings({
      keyword: search.keyword,
      location: search.location,
    });

    // Save job listings to the database
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
  });

  jobs[search.id] = job;
};

export const startMonitoringAllSearches = async () => {
  const searches = await SearchDefinition.findAll();
  searches.forEach(scheduleJob);
};

export const stopJob = (searchId: number) => {
  if (jobs[searchId]) {
    jobs[searchId].cancel();
    delete jobs[searchId];
  }
};
