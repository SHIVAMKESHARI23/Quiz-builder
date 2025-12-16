const Progress = require('../models/Progress');
const Attempt = require('../models/Attempt');

/**
 * @desc    Get user progress
 * @route   GET /api/progress
 * @access  Private
 */
const getUserProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = {
        totalQuizzesAttempted: 0,
        overallAccuracy: 0,
        categoryPerformance: []
      };
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get score history for graph
 * @route   GET /api/progress/history
 * @access  Private
 */
const getScoreHistory = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .sort({ createdAt: 1 })
      .select('score createdAt quizTitle');

    const history = attempts.map((attempt, index) => ({
      attemptNumber: index + 1,
      score: attempt.score,
      date: attempt.createdAt,
      quizTitle: attempt.quizTitle
    }));

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/progress/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id });
    
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
      : 0;
    
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctCount, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const accuracy = totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;

    // Get recent attempts
    const recentAttempts = attempts
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        averageScore,
        accuracy,
        totalCorrect,
        totalQuestions,
        recentAttempts
      }
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getUserProgress, getScoreHistory, getDashboardStats };