const express = require('express');
const { generateExplanation, generateAnalysis } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/explain', protect, aiLimiter, generateExplanation);
router.get('/analysis', protect, aiLimiter, generateAnalysis);

module.exports = router;
