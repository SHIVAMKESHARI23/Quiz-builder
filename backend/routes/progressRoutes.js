const express = require('express');
const {
  getUserProgress,
  getScoreHistory,
  getDashboardStats
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUserProgress);
router.get('/history', protect, getScoreHistory);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
