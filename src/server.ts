import express from 'express';
import bodyParser from 'body-parser';
import searchRoutes from './routes/SearchRoutes';
import sequelize from './db';
import SearchDefinition from './models/SearchDefinition';
import SearchResult from './models/SearchResult';
import { startMonitoringAllSearches } from './services/SearchManager';


sequelize.sync();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', searchRoutes);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await sequelize.authenticate();
    await SearchDefinition.sync();
    await SearchResult.sync();
    await startMonitoringAllSearches();
    console.log('Database connected and models synchronized');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
