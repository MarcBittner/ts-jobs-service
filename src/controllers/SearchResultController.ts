
import { Request, Response } from 'express';
import SearchResult from '../models/SearchResult';
import logger from '../utils/logger';

// Function to get search results by searchId
export const getSearchResults = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results = await SearchResult.findAll({
      where: { searchId: id }
    });

    if (results.length === 0) {
      logger.warn('No results found', { searchId: id });
      return res.status(404).json({ message: 'No results found for this search.' });
    }

    logger.info('Results retrieved successfully', { searchId: id });
    res.status(200).json(results);
  } catch (error: any) {
    logger.error('Error fetching search results', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
