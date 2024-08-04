import express from 'express';
import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { createSearch, getAllSearches, updateSearch, deleteSearch } from './controllers/searchController';
import { startMonitoringAllSearches } from './services/SearchManager';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.post('/search', createSearch);
app.get('/search', getAllSearches);
app.put('/search/:id', updateSearch);
app.delete('/search/:id', deleteSearch);

// Start the server
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await startMonitoringAllSearches();
});
