const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if role is valid
    const validRoles = ['Student', 'Teacher', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Check if user already exists
      const [existingUser] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert user into database
      const [result] = await connection.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
      );
      
      const userId = result.insertId;
      
      // Generate JWT token
      const token = jwt.sign(
        { id: userId, email, role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );
      
      // Return user data and token
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: userId,
          username,
          email,
          role,
          token
        }
      });
      
    } finally {
      connection.release(); // Always release the connection
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

/**
 * @route POST /api/auth/login
 * @description Authenticate user and get token
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Get user from database
      const [users] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const user = users[0];
      
      // Check if role matches (if provided)
      if (role && user.role !== role) {
        return res.status(401).json({ message: 'Invalid role for this user' });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );
      
      // Return user data and token
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          token
        }
      });
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

/**
 * @route GET /api/auth/profile
 * @description Get current user profile
 * @access Private
 */
router.get('/profile', async (req, res) => {
  try {
    // This route should be protected by the verifyToken middleware
    // which will add userId to the request
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      const [users] = await connection.query(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ user: users[0] });
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

module.exports = router;
