const express = require('express');
const {
  submitAttempt,
  getUserAttempts,
  getAttemptById
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getUserAttempts)
  .post(protect, submitAttempt);

router.get('/:id', protect, getAttemptById);

module.exports = router;
