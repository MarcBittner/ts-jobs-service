import { RestliClient } from 'linkedin-api-client';
import { JobListing, QueryParams } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('Access token is not defined.');
}

const restliClient = new RestliClient();

class LinkedInService {
  private readonly apiUrl = 'jobSearch';

  public async fetchJobListings(query: QueryParams): Promise<JobListing[]> {
    try {
      const response = await restliClient.get({
        resourcePath: this.apiUrl,
        accessToken: accessToken,
        query,
      });

      return this.parseJobList(response.data);
    } catch (error) {
      console.error('Error fetching job listings:', error);
      return [];
    }
  }

  private parseJobList(data: any): JobListing[] {
    return data.elements.map((job: any) => ({
      position: job.title,
      company: job.companyName,
      location: job.location,
      date: job.datePosted,
      salary: job.salary,
      jobUrl: job.jobUrl,
    }));
  }
}

export default LinkedInService;
