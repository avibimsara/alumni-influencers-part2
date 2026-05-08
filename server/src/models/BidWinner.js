import { pool } from '../config/db.js';

// Record the winner for a month
const create = async ({ alumniId, winningBidId, month }) => {
  const [result] = await pool.query(
    `INSERT INTO bid_winners (alumni_id, winning_bid_id, month)
     VALUES (?, ?, ?)`,
    [alumniId, winningBidId, month]
  );
  return result.insertId;
};

// Get winner for a specific month
const findByMonth = async (month) => {
  const [rows] = await pool.query(
    `SELECT 
       bw.id,
       bw.alumni_id,
       bw.month,
       bw.selected_at,
       b.bid_amount  as winning_amount,
       b.user_id     as winner_user_id
     FROM bid_winners bw
     JOIN bids b ON bw.winning_bid_id = b.id
     WHERE bw.month = ?`,
    [month]
  );
  return rows[0] || null;
};

// Get all winners 
const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT
       bw.id,
       bw.alumni_id,
       bw.month,
       bw.selected_at,
       b.bid_amount as winning_amount,
       b.user_id    as winner_user_id
     FROM bid_winners bw
     JOIN bids b ON bw.winning_bid_id = b.id
     ORDER BY bw.month DESC`
  );
  return rows;
};

// Check if a winner already exists for this month
const existsForMonth = async (month) => {
  const [rows] = await pool.query(
    `SELECT id FROM bid_winners WHERE month = ?`,
    [month]
  );
  return rows.length > 0;
};

export default {
  create,
  findByMonth,
  getAll,
  existsForMonth
};