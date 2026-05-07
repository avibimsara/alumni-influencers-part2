import { pool } from "../config/db.js";
import { hashToken } from "../utils/tokens.js";

// Function to find a user by email
const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
     [email]);
  return rows[0] || null; // Return the user or null if not found
};

// Find user by ID
const findUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null; 
};

// Create a new user - in register route
const createUser = async ({ email, passwordHash, verificationToken, verificationExpiry }) => {
    const [result] = await pool.query(
        'INSERT INTO users (email, password_hash, verification_token, verification_expiry) VALUES (?, ?, ?, ?)',
        [email, passwordHash, verificationToken, verificationExpiry]
    );
    return result.insertId; // Return the ID of the newly created user
};

// Set is_verified to true and clear token - used in verify email route
const verifyUserEmail = async (userId) => {
    await pool.query(
        'UPDATE users SET is_verified = true, verification_token = NULL, verification_expiry = NULL WHERE id = ?',
        [userId]
    );
};

// Find user by verification token
const findUserByVerificationToken = async (token) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE verification_token = ?',
        [token]
    );
    return rows[0] || null; 
};

// Store reset token and expiry
const setResetToken = async (userId, token, expiry) => {
  const hashedToken = hashToken(token); // Hash the token before storing
  await pool.query(
    `UPDATE users 
     SET reset_token = ?, 
         reset_expiry = ? 
     WHERE id = ?`,
    [hashedToken, expiry, userId]
  );
};

// Find user by reset token - used in reset password route
const findUserByResetToken = async (token) => {
    const hashedToken = hashToken(token); // Hash the token before querying
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE reset_token = ? ',
        [hashedToken]
    );
    return rows[0] || null; 
};

// Update user's password and clear reset token - used in reset password route
const updateUserPassword = async (userId, newPasswordHash) => {
    await pool.query(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE id = ?',
        [newPasswordHash, userId]
    );
};

export default {
    findUserByEmail,
    findUserById,
    createUser,
    verifyUserEmail,
    findUserByVerificationToken,
    setResetToken,
    findUserByResetToken,
    updateUserPassword
};
