const express = require('express');
const { pool } = require('../db');

const router = express.Router();

/**
 * @route GET /api/student/dashboard
 * @description Get student dashboard data
 * @access Private (Student)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.userId;
    const connection = await pool.getConnection();
    
    try {
      // Get completed quizzes
      const [completedQuizzes] = await connection.query(`
        SELECT qa.id as attempt_id, q.id, q.title, qa.score, qa.completed_at
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
      `, [userId]);
      
      // Get available quizzes
      const [availableQuizzes] = await connection.query(`
        SELECT q.*, u.username as created_by_name 
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        WHERE q.is_published = 1 
        AND NOT EXISTS (
          SELECT 1 FROM quiz_attempts a 
          WHERE a.quiz_id = q.id AND a.user_id = ?
        )
      `, [userId]);
      
      // Get statistics
      const [stats] = await connection.query(`
        SELECT 
          COUNT(*) as total_quizzes_taken,
          IFNULL(AVG(score), 0) as average_score,
          MAX(score) as highest_score
        FROM quiz_attempts
        WHERE user_id = ?
      `, [userId]);
      
      res.json({
        completedQuizzes,
        availableQuizzes,
        stats: stats[0]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

/**
 * @route GET /api/student/results
 * @description Get student quiz results
 * @access Private (Student)
 */
router.get('/results', async (req, res) => {
  try {
    const userId = req.userId;
    const connection = await pool.getConnection();
    
    try {
      // Get all quiz attempts by the student
      const [results] = await connection.query(`
        SELECT 
          qa.id as attempt_id,
          q.id as quiz_id,
          q.title,
          qa.score,
          qa.completed_at,
          qa.answers
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
      `, [userId]);
      
      const formattedResults = results.map(result => ({
        ...result,
        answers: JSON.parse(result.answers)
      }));
      
      res.json({ results: formattedResults });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching student results:', error);
    res.status(500).json({ message: 'Failed to fetch results', error: error.message });
  }
});

/**
 * @route GET /api/student/results/:id
 * @description Get detailed result for a specific quiz attempt
 * @access Private (Student)
 */
router.get('/results/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const connection = await pool.getConnection();
    
    try {
      // Get the attempt
      const [attempts] = await connection.query(`
        SELECT 
          qa.*,
          q.title,
          q.description
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        WHERE qa.id = ? AND qa.user_id = ?
      `, [id, userId]);
      
      if (attempts.length === 0) {
        return res.status(404).json({ message: 'Result not found' });
      }
      
      const attempt = attempts[0];
      const answers = JSON.parse(attempt.answers);
      
      // Get quiz questions
      const [questions] = await connection.query(`
        SELECT 
          id, 
          question_text, 
          question_type, 
          options, 
          correct_answer
        FROM quiz_questions 
        WHERE quiz_id = ?
      `, [attempt.quiz_id]);
      
      // Format questions and add user answers
      const formattedQuestions = questions.map(q => {
        const userAnswer = answers.find(a => a.questionId === q.id)?.answer;
        return {
          ...q,
          options: JSON.parse(q.options),
          userAnswer,
          isCorrect: userAnswer === q.correct_answer
        };
      });
      
      res.json({
        result: {
          ...attempt,
          questions: formattedQuestions,
          answers: undefined // Don't send the raw answers
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching result details:', error);
    res.status(500).json({ message: 'Failed to fetch result details', error: error.message });
  }
});

/**
 * @route GET /api/student/leaderboard
 * @description Get leaderboard data
 * @access Private (Student)
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get leaderboard based on average quiz scores
      const [leaderboard] = await connection.query(`
        SELECT 
          u.id,
          u.username,
          COUNT(qa.id) as quizzes_taken,
          ROUND(AVG(qa.score), 2) as average_score,
          MAX(qa.score) as highest_score
        FROM users u
        JOIN quiz_attempts qa ON u.id = qa.user_id
        WHERE u.role = 'Student'
        GROUP BY u.id, u.username
        ORDER BY average_score DESC, quizzes_taken DESC
        LIMIT 20
      `);
      
      res.json({ leaderboard });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
});

module.exports = router;
