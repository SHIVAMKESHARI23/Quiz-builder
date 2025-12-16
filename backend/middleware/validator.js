const { body, validationResult } = require('express-validator');

/**
 * Validation middleware to check for errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: errorMessages.join(', '),
      errors: errors.array()
    });
  }
  next();
};

/**
 * User registration validation rules
 */
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'owner']).withMessage('Invalid role')
];

/**
 * User login validation rules
 */
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * Quiz creation validation rules
 */
const quizValidation = [
  body('title').trim().notEmpty().withMessage('Quiz title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty level'),
  body('timeLimit').isInt({ min: 1, max: 180 }).withMessage('Time limit must be between 1 and 180 minutes'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.questionText').trim().notEmpty().withMessage('Question text is required'),
  body('questions.*.options').isArray({ min: 4, max: 4 }).withMessage('Each question must have exactly 4 options'),
  body('questions.*.correctAnswer').isInt({ min: 0, max: 3 }).withMessage('Correct answer must be between 0 and 3')
];

module.exports = { validate, registerValidation, loginValidation, quizValidation };