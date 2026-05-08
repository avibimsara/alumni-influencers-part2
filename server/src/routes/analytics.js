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

// Get alumni-by-field
router.get('/alumni-by-field', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/alumni-by-field', {
      params: req.query
    });
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get alumni-by-year
router.get('/alumni-by-year', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/alumni-by-year', {
      params: req.query
    });
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get top-employers
router.get('/top-employers', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/top-employers', {
      params: req.query
    });
    return res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get certifications-by-type
router.get('/certifications-by-type', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/certifications-by-type', { params: req.query });
    return res.status(200).json(response.data);
  } catch (error) { next(error); }
});

// Get top-job-titles
router.get('/top-job-titles', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/top-job-titles', { params: req.query });
    return res.status(200).json(response.data);
  } catch (error) { next(error); }
});

// Get geographic-distribution
router.get('/geographic-distribution', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/geographic-distribution', { params: req.query });
    return res.status(200).json(response.data);
  } catch (error) { next(error); }
});

// Get bid-history
router.get('/bid-history', async (req, res, next) => {
  try {
    const response = await part1Client.get('/analytics/bid-history', { params: req.query });
    return res.status(200).json(response.data);
  } catch (error) { next(error); }
});

export default router;