import SearchResult from './models/SearchResult';
import sequelize from './db';

(async () => {
  try {
    // Ensure the database connection is established
    await sequelize.authenticate();

    const testListing = {
      searchId: 1,
      position: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      date: '2024-08-01',
      salary: '$100,000',
      jobUrl: 'http://example.com/job/1',
    };

    // Insert the test data into the SearchResult table
    await SearchResult.create(testListing);
    console.log('Test insertion successful');
  } catch (error) {
    console.error('Test insertion failed', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
})();
