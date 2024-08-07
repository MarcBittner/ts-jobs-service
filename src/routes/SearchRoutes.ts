
import { Router } from 'express';
import { getAllSearches, createSearch, updateSearch, deleteSearch } from '../controllers/SearchController';
import { getSearchResults } from '../controllers/SearchResultController';

const router = Router();

router.get('/searches', getAllSearches);
router.post('/searches', createSearch);
router.put('/searches/:id', updateSearch);
router.delete('/searches/:id', deleteSearch);

// New route to get search results
router.get('/searches/:id/results', getSearchResults);

export default router;
