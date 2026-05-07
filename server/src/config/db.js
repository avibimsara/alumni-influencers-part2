import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // max 10 connections in the pool
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1'); // trivial test query
    connection.release();
    console.log('MySQL connected');
  } catch (error) {
    console.error('DB connection failed:', error);
    process.exit(1);
  }
};


export { pool, connectDB };