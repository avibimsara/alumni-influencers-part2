import { hashApiKey } from '../utils/apiKeyGenerator.js';
import ApiKey from '../models/ApiKey.js';
import ApiUsageLog from '../models/ApiUsageLog.js';

// Middleware to require an API key with specific permission
const requireApiKey = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Read Authorization header
      const authHeader = req.headers.authorization;

      // Check header exists and is Bearer format
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'API key required' });
      }

      // Hash the incoming plaintext key
      const plainTextKey = authHeader.split(' ')[1];
      const keyHash = hashApiKey(plainTextKey);

      // Look up key by hash
      const apiKey = await ApiKey.findByKeyHash(keyHash);

      // Check key exists and is active
      if (!apiKey || !apiKey.is_active) {
        return res.status(401).json({ message: 'Invalid API key' });
      }

      // Check permission
      if (!apiKey.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      // Update last_used timestamp
      await ApiKey.updateLastUsed(apiKey.id);

      // Log the usage
      await ApiUsageLog.create({
        apiKeyId:  apiKey.id,
        endpoint:  req.originalUrl,
        method:    req.method,
        ipAddress: req.ip
      });

      //Attach key info for downstream handlers
      req.apiKey = apiKey;

      next();

    } catch (error) {
      next(error);
    }
  };
};

export default requireApiKey;