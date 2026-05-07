import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import ApiKey from '../models/ApiKey.js';
import ApiUsageLog from '../models/ApiUsageLog.js';
import { generateApiKey, hashApiKey } from '../utils/apiKeyGenerator.js';

const router = Router();

// All routes in this file require admin authentication (jwt)
router.use(requireAuth);

// Post admin api keys
router.post('/', async (req, res, next) => {
  try {
    const { clientName, permissions } = req.body;

    if (!clientName || !permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return res.status(400).json({ message: 'clientName and permissions array are required' });
    }

    // Generate plaintext key and hash it
    const plainTextKey = generateApiKey();
    const keyHash = hashApiKey(plainTextKey);

    const apiKeyId = await ApiKey.create({
      keyHash,
      clientName,
      permissions
    });

    // Return plaintext key
    return res.status(201).json({
      message:  'Store this key securely — it cannot be retrieved again.',
      id:       apiKeyId,
      key:      plainTextKey,  
      clientName,
      permissions
    });

  } catch (error) {
    next(error);
  }
});

// Get all keys (admin only)
router.get('/', async (req, res, next) => {
  try {
    const keys = await ApiKey.getAll();

    // Strip key_hash before sending 
    const safeKeys = keys.map(({ key_hash, ...rest }) => rest);

    return res.status(200).json(safeKeys);

  } catch (error) {
    next(error);
  }
});

// Get stats for all keys (admin only)
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await ApiUsageLog.getStats();
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
});

// Get usage logs for a specific key (admin only)
router.get('/:id/usage', async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit  = parseInt(req.query.limit)  || 10;
    const offset = parseInt(req.query.offset) || 0;

    const usage = await ApiUsageLog.getByApiKeyId(id, { limit, offset });
    return res.status(200).json(usage);

  } catch (error) {
    next(error);
  }
});

// Deactivate a key (admin only)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await ApiKey.deactivate(id);
    return res.status(200).json({ message: 'API key deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;