import { Router } from 'express';
import requireApiKey from '../middleware/requireApiKey.js';
import part1Client from '../services/part1Client.js';

const router = Router();

// Get external clients with read permission
router.get('/alumni', requireApiKey('read:alumni'), async (req, res, next) => {
  try {
    const response = await part1Client.get('/alumni', {
      params: req.query
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Part 1 connection error:', error.message); 
    console.error('Tried to reach:', process.env.PART1_API_BASE_URL);
    next(error);
  }
});

// Get featured alumni with read permission
router.get('/alumni/featured', requireApiKey('read:alumni'), async (req, res, next) => {
  try {
    const response = await part1Client.get('/alumni/featured');
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get single alumni id
router.get('/alumni/:id', requireApiKey('read:alumni'), async (req, res, next) => {
  try {
    const response = await part1Client.get(`/alumni/${req.params.id}`);
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get analytics data with read permission
router.get('/analytics', requireApiKey('read:analytics'), async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/summary', {
      params: req.query
    });
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get alumni of the day with read permission
router.get('/alumni-of-day', requireApiKey('read:alumni_of_day'), async (req, res, next) => {
  try {
    const response = await part1Client.get('/alumni/featured');
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;