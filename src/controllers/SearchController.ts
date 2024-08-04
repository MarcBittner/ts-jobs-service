// ./controllers/SearchController.ts

import { Request, Response } from 'express';
import SearchDefinition from '../models/SearchDefinition';
import { scheduleJob } from '../services/SearchManager';
import logger from '../utils/logger';

export const createSearch = async (req: Request, res: Response) => {
  logger.info('Received request to create search', { body: req.body });

  try {
    const { keyword, location, refreshInterval } = req.body;
    const newSearch = await SearchDefinition.create({ keyword, location, refreshInterval });
    await scheduleJob(newSearch);
    res.status(201).json({ message: 'Search created', data: newSearch });
  } catch (error: any) {
    logger.error('Error creating search', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

export const getAllSearches = async (req: Request, res: Response) => {
  try {
    const searches = await SearchDefinition.findAll();
    res.status(200).json(searches);
  } catch (error: any) {
    logger.error('Error fetching searches', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

export const updateSearch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { keyword, location, refreshInterval } = req.body;
    const search = await SearchDefinition.findByPk(id);

    if (!search) {
      logger.warn('Search not found', { id });
      return res.status(404).json({ error: 'Search not found' });
    }

    search.keyword = keyword || search.keyword;
    search.location = location || search.location;
    search.refreshInterval = refreshInterval || search.refreshInterval;
    await search.save();
    await scheduleJob(search);
    res.status(200).json(search);
  } catch (error: any) {
    logger.error('Error updating search', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

export const deleteSearch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const search = await SearchDefinition.findByPk(id);

    if (!search) {
      logger.warn('Search not found', { id });
      return res.status(404).json({ error: 'Search not found' });
    }

    await search.destroy();
    res.status(200).json({ message: 'Search deleted' });
  } catch (error: any) {
    logger.error('Error deleting search', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
