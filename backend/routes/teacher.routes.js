const express = require('express');
const { pool } = require('../db');

const router = express.Router();

/**
 * @route GET /api/teacher/dashboard
 * @description Get teacher dashboard data
 * @access Private (Teacher)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.userId;
    const connection = await pool.getConnection();
    
    try {
      // Get teacher's quizzes
      const [quizzes] = await connection.query(`
        SELECT 
          q.id, 
          q.title, 
          q.description, 
          q.is_published,
          q.created_at,
          (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id) as attempt_count,
          (SELECT IFNULL(AVG(score), 0) FROM quiz_attempts WHERE quiz_id = q.id) as average_score
        FROM quizzes q
        WHERE q.created_by = ?
        ORDER BY q.created_at DESC
      `, [userId]);
      
      // Get recent quiz attempts
      const [recentAttempts] = await connection.query(`
        SELECT 
          qa.id as attempt_id,
          q.id as quiz_id,
          q.title,
          u.username as student_name,
          qa.score,
          qa.completed_at
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        JOIN users u ON qa.user_id = u.id
        WHERE q.created_by = ?
        ORDER BY qa.completed_at DESC
        LIMIT 10
      `, [userId]);
      
      // Get statistics
      const [stats] = await connection.query(`
        SELECT 
          COUNT(*) as total_quizzes,
          SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published_quizzes,
          (
            SELECT COUNT(DISTINCT user_id) 
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.created_by = ?
          ) as total_students
        FROM quizzes
        WHERE created_by = ?
      `, [userId, userId]);
      
      res.json({
        quizzes,
        recentAttempts,
        stats: stats[0]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

/**
 * @route POST /api/teacher/quizzes
 * @description Create a new quiz
 * @access Private (Teacher)
 */
router.post('/quizzes', async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, questions } = req.body;
    
    // Validate input
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Quiz title and at least one question are required' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      // Create quiz
      const [result] = await connection.query(`
        INSERT INTO quizzes (title, description, created_by, is_published)
        VALUES (?, ?, ?, ?)
      `, [title, description || '', userId, 0]); // Default to unpublished
      
      const quizId = result.insertId;
      
      // Add questions
      for (const question of questions) {
        if (!question.questionText || !question.correctAnswer) {
          await connection.rollback();
          return res.status(400).json({ message: 'Each question must have text and a correct answer' });
        }
        
        await connection.query(`
          INSERT INTO quiz_questions (
            quiz_id, 
            question_text, 
            question_type, 
            options, 
            correct_answer
          )
          VALUES (?, ?, ?, ?, ?)
        `, [
          quizId,
          question.questionText,
          question.questionType || 'multiple_choice',
          JSON.stringify(question.options || []),
          question.correctAnswer
        ]);
      }
      
      // Commit transaction
      await connection.commit();
      
      res.status(201).json({
        message: 'Quiz created successfully',
        quiz: { id: quizId, title, description }
      });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz', error: error.message });
  }
});

/**
 * @route PUT /api/teacher/quizzes/:id
 * @description Update an existing quiz
 * @access Private (Teacher)
 */
router.put('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description, questions, isPublished } = req.body;
    
    const connection = await pool.getConnection();
    
    try {
      // Check if quiz exists and belongs to this teacher
      const [quizzes] = await connection.query(`
        SELECT * FROM quizzes WHERE id = ? AND created_by = ?
      `, [id, userId]);
      
      if (quizzes.length === 0) {
        return res.status(404).json({ message: 'Quiz not found or not authorized to edit' });
      }
      
      // Start transaction
      await connection.beginTransaction();
      
      // Update quiz
      await connection.query(`
        UPDATE quizzes 
        SET title = ?, description = ?, is_published = ?, updated_at = NOW()
        WHERE id = ?
      `, [
        title || quizzes[0].title,
        description !== undefined ? description : quizzes[0].description,
        isPublished !== undefined ? isPublished : quizzes[0].is_published,
        id
      ]);
      
      // If questions are provided, update them
      if (questions && Array.isArray(questions)) {
        // Delete existing questions
        await connection.query('DELETE FROM quiz_questions WHERE quiz_id = ?', [id]);
        
        // Add new questions
        for (const question of questions) {
          if (!question.questionText || !question.correctAnswer) {
            await connection.rollback();
            return res.status(400).json({ message: 'Each question must have text and a correct answer' });
          }
          
          await connection.query(`
            INSERT INTO quiz_questions (
              quiz_id, 
              question_text, 
              question_type, 
              options, 
              correct_answer
            )
            VALUES (?, ?, ?, ?, ?)
          `, [
            id,
            question.questionText,
            question.questionType || 'multiple_choice',
            JSON.stringify(question.options || []),
            question.correctAnswer
          ]);
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      res.json({ message: 'Quiz updated successfully' });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz', error: error.message });
  }
});

/**
 * @route DELETE /api/teacher/quizzes/:id
 * @description Delete a quiz
 * @access Private (Teacher)
 */
router.delete('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const connection = await pool.getConnection();
    
    try {
      // Check if quiz exists and belongs to this teacher
      const [quizzes] = await connection.query(`
        SELECT * FROM quizzes WHERE id = ? AND created_by = ?
      `, [id, userId]);
      
      if (quizzes.length === 0) {
        return res.status(404).json({ message: 'Quiz not found or not authorized to delete' });
      }
      
      // Start transaction
      await connection.beginTransaction();
      
      // Delete quiz attempts
      await connection.query('DELETE FROM quiz_attempts WHERE quiz_id = ?', [id]);
      
      // Delete quiz questions
      await connection.query('DELETE FROM quiz_questions WHERE quiz_id = ?', [id]);
      
      // Delete quiz
      await connection.query('DELETE FROM quizzes WHERE id = ?', [id]);
      
      // Commit transaction
      await connection.commit();
      
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Failed to delete quiz', error: error.message });
  }
});

/**
 * @route GET /api/teacher/quizzes/:id/results
 * @description Get results for a specific quiz
 * @access Private (Teacher)
 */
router.get('/quizzes/:id/results', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const connection = await pool.getConnection();
    
    try {
      // Check if quiz exists and belongs to this teacher
      const [quizzes] = await connection.query(`
        SELECT * FROM quizzes WHERE id = ? AND created_by = ?
      `, [id, userId]);
      
      if (quizzes.length === 0) {
        return res.status(404).json({ message: 'Quiz not found or not authorized to view results' });
      }
      
      // Get quiz attempts
      const [attempts] = await connection.query(`
        SELECT 
          qa.id as attempt_id,
          u.id as student_id,
          u.username as student_name,
          u.email as student_email,
          qa.score,
          qa.completed_at,
          qa.answers
        FROM quiz_attempts qa
        JOIN users u ON qa.user_id = u.id
        WHERE qa.quiz_id = ?
        ORDER BY qa.completed_at DESC
      `, [id]);
      
      // Get questions for the quiz
      const [questions] = await connection.query(`
        SELECT id, question_text, correct_answer 
        FROM quiz_questions 
        WHERE quiz_id = ?
      `, [id]);
      
      // Calculate statistics
      const totalAttempts = attempts.length;
      const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / (totalAttempts || 1);
      
      // Format attempts data
      const formattedAttempts = attempts.map(attempt => ({
        ...attempt,
        answers: JSON.parse(attempt.answers)
      }));
      
      res.json({
        quizTitle: quizzes[0].title,
        statistics: {
          totalAttempts,
          averageScore
        },
        attempts: formattedAttempts,
        questions
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Failed to fetch quiz results', error: error.message });
  }
});

module.exports = router;
