const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Function to create database if it doesn't exist
async function createDatabase() {
  try {
    // First connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'quizz_db'}`);
    console.log(`Database '${process.env.DB_NAME || 'quizz_db'}' created or already exists`);
    
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quizz_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database tables if they don't exist
async function initializeDatabase() {
  try {
    // First ensure database exists
    await createDatabase();
    
    const connection = await pool.getConnection();
    
    try {
      console.log('Initializing database tables...');
      
      // Users table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('Student', 'Teacher', 'Admin') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX (email),
          INDEX (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      
      // Quizzes table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS quizzes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          created_by INT NOT NULL,
          is_published BOOLEAN DEFAULT FALSE,
          time_limit INT DEFAULT NULL COMMENT 'Time limit in minutes',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id),
          INDEX (created_by),
          INDEX (is_published)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      
      // Quiz questions table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS quiz_questions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          quiz_id INT NOT NULL,
          question_text TEXT NOT NULL,
          question_type ENUM('multiple_choice', 'true_false', 'short_answer') DEFAULT 'multiple_choice',
          options JSON COMMENT 'Array of option objects',
          correct_answer TEXT NOT NULL,
          points INT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
          INDEX (quiz_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      
      // Quiz attempts table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS quiz_attempts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          quiz_id INT NOT NULL,
          score DECIMAL(5,2) DEFAULT 0 COMMENT 'Score in percentage',
          answers JSON COMMENT 'JSON array of answer objects',
          started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP DEFAULT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
          INDEX (user_id),
          INDEX (quiz_id),
          INDEX (completed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      
      // Create default users if no users exist
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      if (users[0].count === 0) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        
        // Create admin account
        const adminPassword = await bcrypt.hash('admin123', saltRounds);
        await connection.query(`
          INSERT INTO users (username, email, password, role)
          VALUES ('Admin', 'admin@quizz.com', ?, 'Admin')
        `, [adminPassword]);
        console.log('Default admin user created: email=admin@quizz.com, password=admin123');
        
        // Create teacher account
        const teacherPassword = await bcrypt.hash('teacher123', saltRounds);
        await connection.query(`
          INSERT INTO users (username, email, password, role)
          VALUES ('Teacher', 'teacher@quizz.com', ?, 'Teacher')
        `, [teacherPassword]);
        console.log('Default teacher user created: email=teacher@quizz.com, password=teacher123');
        
        // Create student account
        const studentPassword = await bcrypt.hash('student123', saltRounds);
        await connection.query(`
          INSERT INTO users (username, email, password, role)
          VALUES ('Student', 'student@quizz.com', ?, 'Student')
        `, [studentPassword]);
        console.log('Default student user created: email=student@quizz.com, password=student123');
      }
      
      console.log('Database initialized successfully');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  createDatabase
};
