const express = require('express');
const { pool } = require('../db');

const router = express.Router();

/**
 * @route GET /api/quizzes
 * @description Get all available quizzes
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const { role, userId } = req;
    const connection = await pool.getConnection();
    
    try {
      let quizzes;
      
      if (role === 'Student') {
        // Students see only published quizzes they haven't completed
        const [studentQuizzes] = await connection.query(`
          SELECT q.*, u.username as created_by_name 
          FROM quizzes q
          JOIN users u ON q.created_by = u.id
          WHERE q.is_published = 1 
          AND NOT EXISTS (
            SELECT 1 FROM quiz_attempts a 
            WHERE a.quiz_id = q.id AND a.user_id = ?
          )
        `, [userId]);
        quizzes = studentQuizzes;
      } else if (role === 'Teacher') {
        // Teachers see their own quizzes
        const [teacherQuizzes] = await connection.query(`
          SELECT q.*, u.username as created_by_name 
          FROM quizzes q
          JOIN users u ON q.created_by = u.id
          WHERE q.created_by = ?
        `, [userId]);
        quizzes = teacherQuizzes;
      } else if (role === 'Admin') {
        // Admins see all quizzes
        const [allQuizzes] = await connection.query(`
          SELECT q.*, u.username as created_by_name 
          FROM quizzes q
          JOIN users u ON q.created_by = u.id
        `);
        quizzes = allQuizzes;
      }
      
      res.json({ quizzes });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes', error: error.message });
  }
});

/**
 * @route GET /api/quizzes/:id
 * @description Get a specific quiz by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, userId } = req;
    const connection = await pool.getConnection();
    
    try {
      // First get the quiz
      const [quizzes] = await connection.query(`
        SELECT q.*, u.username as created_by_name 
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        WHERE q.id = ?
      `, [id]);
      
      if (quizzes.length === 0) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      const quiz = quizzes[0];
      
      // Check access permissions
      if (role === 'Student' && !quiz.is_published) {
        return res.status(403).json({ message: 'This quiz is not available' });
      }
      
      if (role === 'Teacher' && quiz.created_by !== userId) {
        return res.status(403).json({ message: 'You do not have access to this quiz' });
      }
      
      // Get quiz questions
      const [questions] = await connection.query(`
        SELECT id, question_text, question_type, options 
        FROM quiz_questions 
        WHERE quiz_id = ?
      `, [id]);
      
      // Format questions
      const formattedQuestions = questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }));
      
      res.json({
        quiz: {
          ...quiz,
          questions: formattedQuestions
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Failed to fetch quiz', error: error.message });
  }
});

/**
 * @route POST /api/quizzes/:id/submit
 * @description Submit a quiz attempt
 * @access Private (Student)
 */
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userRole } = req;
    const { answers } = req.body;
    
    // Only students can submit quizzes
    if (userRole !== 'Student') {
      return res.status(403).json({ message: 'Only students can submit quiz attempts' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      // Check if quiz exists and is published
      const [quizzes] = await connection.query(`
        SELECT * FROM quizzes WHERE id = ? AND is_published = 1
      `, [id]);
      
      if (quizzes.length === 0) {
        return res.status(404).json({ message: 'Quiz not found or not available' });
      }
      
      const quiz = quizzes[0];
      
      // Check if user has already attempted this quiz
      const [existingAttempts] = await connection.query(`
        SELECT * FROM quiz_attempts WHERE quiz_id = ? AND user_id = ?
      `, [id, userId]);
      
      if (existingAttempts.length > 0) {
        return res.status(400).json({ message: 'You have already attempted this quiz' });
      }
      
      // Get correct answers
      const [questions] = await connection.query(`
        SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = ?
      `, [id]);
      
      // Calculate score
      let score = 0;
      let totalQuestions = questions.length;
      
      questions.forEach(question => {
        const userAnswer = answers.find(a => a.questionId === question.id)?.answer;
        if (userAnswer && userAnswer === question.correct_answer) {
          score++;
        }
      });
      
      const percentageScore = (score / totalQuestions) * 100;
      
      // Record the attempt
      const [result] = await connection.query(`
        INSERT INTO quiz_attempts (user_id, quiz_id, score, answers, completed_at)
        VALUES (?, ?, ?, ?, NOW())
      `, [userId, id, percentageScore, JSON.stringify(answers)]);
      
      const attemptId = result.insertId;
      
      // Commit transaction
      await connection.commit();
      
      res.json({
        message: 'Quiz submitted successfully',
        result: {
          attemptId,
          score: percentageScore,
          correctAnswers: score,
          totalQuestions
        }
      });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz', error: error.message });
  }
});

module.exports = router;
