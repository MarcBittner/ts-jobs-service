const SearchResult = require('./src/models/SearchResult').default;
const sequelize = require('./src/db').default;

(async () => {
  try {
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
    await SearchResult.create(testListing);
    console.log('Test insertion successful');
  } catch (error) {
    console.error('Test insertion failed', error);
  } finally {
    await sequelize.close();
  }
})();
