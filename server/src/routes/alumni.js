import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import part1Client from '../services/part1Client.js';

const router = Router();

// Require jwt auth
router.use(requireAuth);

// Get all alumni
router.get('/', async (req, res, next) => {
  try {
    const response = await part1Client.get('/alumni', {
      params: req.query // forward 
    });
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get single alumni
router.get('/:id', async (req, res, next) => {
  try {
    const response = await part1Client.get(`/alumni/${req.params.id}`);
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;