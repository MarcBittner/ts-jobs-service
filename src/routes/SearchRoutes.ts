// src/routes/searchRoutes.ts

import { Router } from 'express';
import { getAllSearches, createSearch, updateSearch, deleteSearch } from '../controllers/SearchController';

const router = Router();

router.get('/searches', getAllSearches);
router.post('/searches', createSearch);
router.put('/searches/:id', updateSearch);
router.delete('/searches/:id', deleteSearch);

export default router;
