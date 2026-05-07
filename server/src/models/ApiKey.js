import {pool} from '../config/db.js';

// Create a new API key with permissions — uses transaction for data integrity
const create = async ({ keyHash, clientName, permissions }) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Insert the key
    const [result] = await connection.query(
      `INSERT INTO api_keys (key_hash, client_name) VALUES (?, ?)`,
      [keyHash, clientName]
    );
    const apiKeyId = result.insertId;

    // Insert each permission 
    for (const permission of permissions) {
      await connection.query(
        `INSERT INTO api_key_permissions (api_key_id, permission) VALUES (?, ?)`,
        [apiKeyId, permission]
      );
    }

    await connection.commit();
    return apiKeyId;

  } catch (error) {
    // If anything fails, roll back 
    await connection.rollback();
    throw error;
  } finally {
    connection.release(); // release connection back to pool
  }
};

// Find a key by its hash
const findByKeyHash = async (keyHash) => {
  const [rows] = await pool.query(
    `SELECT 
      k.id,
      k.key_hash,
      k.client_name,
      k.is_active,
      k.last_used,
      k.created_at,
      p.permission
     FROM api_keys k
     LEFT JOIN api_key_permissions p ON k.id = p.api_key_id
     WHERE k.key_hash = ?`,
    [keyHash]
  );

  if (rows.length === 0) return null;

  // Group keys with different permissions
  const key = {
    id:          rows[0].id,
    key_hash:    rows[0].key_hash,
    client_name: rows[0].client_name,
    is_active:   rows[0].is_active,
    last_used:   rows[0].last_used,
    created_at:  rows[0].created_at,
    permissions: rows.map(row => row.permission).filter(Boolean)
  };

  return key;
};

// Update last_used timestamp 
const updateLastUsed = async (id) => {
  await pool.query(
    `UPDATE api_keys SET last_used = NOW() WHERE id = ?`,
    [id]
  );
};

// Soft delete a key
const deactivate = async (id) => {
  await pool.query(
    `UPDATE api_keys SET is_active = false WHERE id = ?`,
    [id]
  );
};

// Get all keys with their permissions (admin)
const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT
      k.id,
      k.client_name,
      k.is_active,
      k.last_used,
      k.created_at,
      p.permission
     FROM api_keys k
     LEFT JOIN api_key_permissions p ON k.id = p.api_key_id
     ORDER BY k.created_at DESC`
  );

  if (rows.length === 0) return [];

  // Group rows by key id 
  const keysMap = {};
  for (const row of rows) {
    if (!keysMap[row.id]) {
      keysMap[row.id] = {
        id:          row.id,
        client_name: row.client_name,
        is_active:   row.is_active,
        last_used:   row.last_used,
        created_at:  row.created_at,
        permissions: []
      };
    }
    if (row.permission) {
      keysMap[row.id].permissions.push(row.permission);
    }
  }

  return Object.values(keysMap);
};

// Get usage stats for a specific key (admin))
const getUsageStats = async (apiKeyId) => {
  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total_requests
     FROM api_usage_logs
     WHERE api_key_id = ?`,
    [apiKeyId]
  );

  const [recentLogs] = await pool.query(
    `SELECT endpoint, method, ip_address, timestamp
     FROM api_usage_logs
     WHERE api_key_id = ?
     ORDER BY timestamp DESC
     LIMIT 10`,
    [apiKeyId]
  );

  return {
    total_requests: countResult[0].total_requests,
    recent_logs:    recentLogs
  };
};

export default {
  create,
  findByKeyHash,
  updateLastUsed,
  deactivate,
  getAll,
  getUsageStats
};