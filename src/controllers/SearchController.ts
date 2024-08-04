// ./src/controllers/searchController.ts

import { Request, Response } from 'express';
import SearchDefinition from '../models/SearchDefinition';
import { scheduleJob } from '../services/SearchManager';

export const createSearch = async (req: Request, res: Response) => {
  console.log('Received request to create search:', req.body); // Log request body

  try {
    const { keyword, location, refreshInterval } = req.body;
    const newSearch = await SearchDefinition.create({ keyword, location, refreshInterval });
    await scheduleJob(newSearch); // Schedule job for the new search
    res.status(201).json({ message: 'Search created', data: newSearch });
  } catch (error: any) {
    console.error('Error creating search:', error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

export const getAllSearches = async (req: Request, res: Response) => {
  try {
    const searches = await SearchDefinition.findAll();
    res.status(200).json(searches);
  } catch (error: any) {
    console.error('Error fetching searches:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateSearch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { keyword, location, refreshInterval } = req.body;
    const search = await SearchDefinition.findByPk(id);

    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    search.keyword = keyword || search.keyword;
    search.location = location || search.location;
    search.refreshInterval = refreshInterval || search.refreshInterval;
    await search.save();
    await scheduleJob(search); // Reschedule job with updated details
    res.status(200).json(search);
  } catch (error: any) {
    console.error('Error updating search:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSearch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const search = await SearchDefinition.findByPk(id);

    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    await search.destroy();
    res.status(200).json({ message: 'Search deleted' });
  } catch (error: any) {
    console.error('Error deleting search:', error);
    res.status(500).json({ error: error.message });
  }
};
