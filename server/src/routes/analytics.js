import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import part1Client from '../services/part1Client.js';

const router = Router();

// Require jwt auth
router.use(requireAuth);

// Get analytics data
router.get('/', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics', {
      params: req.query
    });
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get summary stats
router.get('/summary', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/summary');
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;