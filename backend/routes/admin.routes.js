const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../db');

const router = express.Router();

/**
 * @route GET /api/admin/dashboard
 * @description Get admin dashboard data
 * @access Private (Admin)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get user stats
      const [userStats] = await connection.query(`
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'Student' THEN 1 ELSE 0 END) as student_count,
          SUM(CASE WHEN role = 'Teacher' THEN 1 ELSE 0 END) as teacher_count,
          SUM(CASE WHEN role = 'Admin' THEN 1 ELSE 0 END) as admin_count
        FROM users
      `);
      
      // Get quiz stats
      const [quizStats] = await connection.query(`
        SELECT 
          COUNT(*) as total_quizzes,
          SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published_quizzes
        FROM quizzes
      `);
      
      // Get attempt stats
      const [attemptStats] = await connection.query(`
        SELECT 
          COUNT(*) as total_attempts,
          IFNULL(AVG(score), 0) as average_score
        FROM quiz_attempts
      `);
      
      // Get recent users
      const [recentUsers] = await connection.query(`
        SELECT id, username, email, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);
      
      // Get recent quizzes
      const [recentQuizzes] = await connection.query(`
        SELECT 
          q.id, 
          q.title, 
          q.is_published,
          u.username as created_by_name,
          q.created_at
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        ORDER BY q.created_at DESC
        LIMIT 5
      `);
      
      res.json({
        userStats: userStats[0],
        quizStats: quizStats[0],
        attemptStats: attemptStats[0],
        recentUsers,
        recentQuizzes
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

/**
 * @route GET /api/admin/users
 * @description Get all users
 * @access Private (Admin)
 */
router.get('/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [users] = await connection.query(`
        SELECT id, username, email, role, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
      `);
      
      res.json({ users });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

/**
 * @route POST /api/admin/users
 * @description Create a new user
 * @access Private (Admin)
 */
router.post('/users', async (req, res) => {
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
      
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: userId,
          username,
          email,
          role
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

/**
 * @route PUT /api/admin/users/:id
 * @description Update a user
 * @access Private (Admin)
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    
    const connection = await pool.getConnection();
    
    try {
      // Check if user exists
      const [users] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Prepare update fields
      const updates = [];
      const params = [];
      
      if (username) {
        updates.push('username = ?');
        params.push(username);
      }
      
      if (email) {
        // Check if email already exists for another user
        if (email !== users[0].email) {
          const [existingUser] = await connection.query(
            'SELECT * FROM users WHERE email = ? AND id != ?',
            [email, id]
          );
          
          if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email already in use by another user' });
          }
        }
        
        updates.push('email = ?');
        params.push(email);
      }
      
      if (role) {
        const validRoles = ['Student', 'Teacher', 'Admin'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ message: 'Invalid role' });
        }
        
        updates.push('role = ?');
        params.push(role);
      }
      
      if (password) {
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        updates.push('password = ?');
        params.push(hashedPassword);
      }
      
      // Add updated_at timestamp
      updates.push('updated_at = NOW()');
      
      // Only update if there are fields to update
      if (updates.length > 0) {
        params.push(id);
        
        await connection.query(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
      }
      
      res.json({ message: 'User updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

/**
 * @route DELETE /api/admin/users/:id
 * @description Delete a user
 * @access Private (Admin)
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      // Check if user exists
      const [users] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Delete user's quiz attempts
      await connection.query(
        'DELETE FROM quiz_attempts WHERE user_id = ?',
        [id]
      );
      
      // If user is a teacher, handle their quizzes
      if (users[0].role === 'Teacher') {
        // Get all quizzes by this teacher
        const [quizzes] = await connection.query(
          'SELECT id FROM quizzes WHERE created_by = ?',
          [id]
        );
        
        for (const quiz of quizzes) {
          // Delete quiz attempts
          await connection.query(
            'DELETE FROM quiz_attempts WHERE quiz_id = ?',
            [quiz.id]
          );
          
          // Delete quiz questions
          await connection.query(
            'DELETE FROM quiz_questions WHERE quiz_id = ?',
            [quiz.id]
          );
        }
        
        // Delete all quizzes by this teacher
        await connection.query(
          'DELETE FROM quizzes WHERE created_by = ?',
          [id]
        );
      }
      
      // Delete the user
      await connection.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      // Commit transaction
      await connection.commit();
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;
