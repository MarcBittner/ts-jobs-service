
import { RestliClient } from 'linkedin-api-client';
import dotenv from 'dotenv';

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN || process.env.LINKEDIN_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('Access token is not defined. Please check your environment variables.');
}

const restliClient = new RestliClient();

const fetchJobListings = async (queryObject: { keyword: string; location: string }) => {
  try {
    const response = await restliClient.get({
      resourcePath: `jobSearch?q=jobs&keywords=${encodeURIComponent(queryObject.keyword)}&location=${encodeURIComponent(queryObject.location)}`,
      accessToken: accessToken as string,
    });
    return response.data.elements;
  } catch (error) {
    console.error('Error fetching job listings:', error);
    return [];
  }
};

export default fetchJobListings;
