const express = require('express');
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  getMyQuizzes,
  updateQuiz,
  deleteQuiz,
  getQuizAttempts
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');
const { quizValidation, validate } = require('../middleware/validator');

const router = express.Router();

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, authorize('owner'), quizValidation, validate, createQuiz);

router.get('/my-quizzes', protect, authorize('owner'), getMyQuizzes);

router.route('/:id')
  .get(protect, getQuizById)
  .put(protect, authorize('owner'), quizValidation, validate, updateQuiz)
  .delete(protect, authorize('owner'), deleteQuiz);

router.get('/:id/attempts', protect, authorize('owner'), getQuizAttempts);

module.exports = router;
