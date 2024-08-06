import puppeteer from 'puppeteer';
import { JobListing } from '../types';
import logger from '../utils/logger';
import fs from 'fs';

const fetchJobListings = async (queryObject: { keyword: string; location: string }): Promise<JobListing[]> => {
  const { keyword, location } = queryObject;
  const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;

  logger.info('Starting job listings scraping', { keyword, location, url });

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' }); // Ensures all network activity is finished

    logger.info('Page loaded', { url });

    // Save the HTML content to a file for inspection
    const pageContent = await page.content();
    fs.writeFileSync('scrapedPage.html', pageContent);
    logger.info('Page content saved for inspection', { filePath: 'scrapedPage.html' });

    // Take a screenshot to verify visual state
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    logger.info('Screenshot taken for inspection', { filePath: 'screenshot.png' });

    // Ensure the selector is found or retry
    try {
      await page.waitForSelector('.base-search-card', { timeout: 60000 });
      logger.info('Selector found, extracting job listings');

      // Scrape the job listings
      const jobListings: JobListing[] = await page.evaluate(() => {
        const jobs = Array.from(document.querySelectorAll('.base-search-card')).map(jobElement => {
          const titleElement = jobElement.querySelector('.base-search-card__title');
          const companyElement = jobElement.querySelector('.base-search-card__subtitle');
          const locationElement = jobElement.querySelector('.job-search-card__location');
          const dateElement = jobElement.querySelector('time.job-search-card__listdate');
          const linkElement = jobElement.querySelector<HTMLAnchorElement>('.base-card__full-link');

          const title = titleElement ? (titleElement as HTMLElement).innerText.trim() : '';
          const company = companyElement ? (companyElement as HTMLElement).innerText.trim() : '';
          const location = locationElement ? (locationElement as HTMLElement).innerText.trim() : '';
          const date = dateElement ? (dateElement as HTMLElement).innerText.trim() : '';
          const jobUrl = linkElement ? linkElement.href : '';

          return {
            position: title,
            company,
            location,
            date,
            salary: '', // Placeholder for salary, as it’s not extracted from the provided HTML snippet
            jobUrl
          } as JobListing;
        });
        return jobs;
      });

      logger.info('Job listings scraped successfully', { count: jobListings.length, jobListings });
      return jobListings;

    } catch (error) {
      logger.error('Selector not found within timeout period', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }

  } catch (error: any) {
    logger.error('Error occurred during scraping', { error: error.message });
    return [];
  } finally {
    if (browser) {
      await browser.close();
      logger.info('Browser closed');
    }
  }
};

export default fetchJobListings;
