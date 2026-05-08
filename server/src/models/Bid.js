import { pool } from '../config/db.js';

// Create a new bid 
const create = async ({ userId, alumniId, bidAmount, month }) => {
  const [result] = await pool.query(
    `INSERT INTO bids (user_id, alumni_id, bid_amount, month, status)
     VALUES (?, ?, ?, ?, 'pending')`,
    [userId, alumniId, bidAmount, month]
  );
  return result.insertId;
};

// Find a single bid by ID
const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM bids WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

// Check if user already bid on this alumni this month
const findByUserAndAlumni = async ({ userId, alumniId, month }) => {
  const [rows] = await pool.query(
    `SELECT * FROM bids
     WHERE user_id = ? AND alumni_id = ? AND month = ?`,
    [userId, alumniId, month]
  );
  return rows[0] || null;
};

// Count how many bids user has placed this month
const countByUserThisMonth = async ({ userId, month }) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM bids
     WHERE user_id = ? AND month = ?`,
    [userId, month]
  );
  return rows[0].count;
};

// Update bid amount 
const update = async ({ id, bidAmount }) => {
  await pool.query(
    `UPDATE bids
     SET bid_amount = ?
     WHERE id = ?`,
    [bidAmount, id]
  );
};

// Get all bids for a user this month with their status
const getStatusForUser = async ({ userId, month }) => {
  const [rows] = await pool.query(
    `SELECT 
       b.id,
       b.alumni_id,
       b.bid_amount,
       b.month,
       b.status,
       b.created_at,
       b.updated_at
     FROM bids b
     WHERE b.user_id = ? AND b.month = ?
     ORDER BY b.created_at DESC`,
    [userId, month]
  );
  return rows;
};

// Get highest bid per alumni for a given month 
const getAllPendingForMonth = async (month) => {
  const [rows] = await pool.query(
    `SELECT b.id as bid_id, b.alumni_id, b.user_id, b.bid_amount
     FROM bids b
     INNER JOIN (
       SELECT alumni_id, MAX(bid_amount) as max_bid
       FROM bids
       WHERE month = ? AND status = 'pending'
       GROUP BY alumni_id
     ) highest
     ON b.alumni_id = highest.alumni_id
     AND b.bid_amount = highest.max_bid
     WHERE b.month = ? AND b.status = 'pending'`,
    [month, month]
  );
  return rows;
};

// Mark a bid as won
const markWon = async (id) => {
  await pool.query(
    `UPDATE bids SET status = 'won' WHERE id = ?`,
    [id]
  );
};

// Mark a bid as lost
const markLost = async (id) => {
  await pool.query(
    `UPDATE bids SET status = 'lost' WHERE id = ?`,
    [id]
  );
};

export default {
  create,
  findById,
  findByUserAndAlumni,
  countByUserThisMonth,
  update,
  getStatusForUser,
  getAllPendingForMonth,
  markWon,
  markLost
};