import { pool } from '../config/db.js';

// called on every authenticated API request
const create = async ({ apiKeyId, endpoint, method, ipAddress }) => {
  const [result] = await pool.query(
    `INSERT INTO api_usage_logs (api_key_id, endpoint, method, ip_address)
     VALUES (?, ?, ?, ?)`,
    [apiKeyId, endpoint, method, ipAddress]
  );
  return result.insertId;
};

// Paginated retrieval for stats view
const getByApiKeyId = async (apiKeyId, { limit = 10, offset = 0 }) => {
  const [rows] = await pool.query(
    `SELECT id, endpoint, method, ip_address, timestamp
     FROM api_usage_logs
     WHERE api_key_id = ?
     ORDER BY timestamp DESC
     LIMIT ? OFFSET ?`,
    [apiKeyId, limit, offset]
  );

  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total FROM api_usage_logs WHERE api_key_id = ?`,
    [apiKeyId]
  );

  return {
    logs:  rows,
    total: countResult[0].total,
    limit,
    offset
  };
};

// stats across all keys (admin)
const getStats = async () => {
  // Count per key + most recent access
  const [perKey] = await pool.query(
    `SELECT
      k.id,
      k.client_name,
      COUNT(l.id)    AS total_requests,
      MAX(l.timestamp) AS last_access
     FROM api_keys k
     LEFT JOIN api_usage_logs l ON k.id = l.api_key_id
     GROUP BY k.id, k.client_name
     ORDER BY total_requests DESC`
  );

  // Count per endpoint (shows which API endpoints are most used)
  const [perEndpoint] = await pool.query(
    `SELECT
      endpoint,
      method,
      COUNT(*) AS total_requests
     FROM api_usage_logs
     GROUP BY endpoint, method
     ORDER BY total_requests DESC`
  );

  return {
    per_key:      perKey,
    per_endpoint: perEndpoint
  };
};

export default {
  create,
  getByApiKeyId,
  getStats
};