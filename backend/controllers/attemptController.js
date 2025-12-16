const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');

/**
 * @desc    Submit quiz attempt
 * @route   POST /api/attempts
 * @access  Private
 */
const submitAttempt = async (req, res, next) => {
  try {
    const { quizId, selectedAnswers, timeTaken } = req.body;

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check for duplicate attempt
    const existingAttempt = await Attempt.findOne({
      userId: req.user.id,
      quizId: quizId
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: 'You have already attempted this quiz'
      });
    }

    // Calculate score
    let correctCount = 0;
    let wrongCount = 0;
    const processedAnswers = [];

    selectedAnswers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedOption === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      processedAnswers.push({
        questionId: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        correctAnswer: question.correctAnswer,
        questionText: question.questionText,
        options: question.options
      });
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Create attempt
    const attempt = await Attempt.create({
      userId: req.user.id,
      quizId: quiz._id,
      quizTitle: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      selectedAnswers: processedAnswers,
      score,
      correctCount,
      wrongCount,
      totalQuestions,
      timeTaken
    });

    // Update user progress
    await updateUserProgress(req.user.id, quiz.category, score, correctCount, totalQuestions);

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: attempt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to update user progress
 */
const updateUserProgress = async (userId, category, score, correctCount, totalQuestions) => {
  let progress = await Progress.findOne({ userId });

  if (!progress) {
    progress = await Progress.create({
      userId,
      totalQuizzesAttempted: 1,
      overallAccuracy: score,
      categoryPerformance: [{
        category,
        totalAttempts: 1,
        averageScore: score,
        totalCorrect: correctCount,
        totalQuestions
      }]
    });
  } else {
    progress.totalQuizzesAttempted += 1;

    // Update category performance
    const categoryIndex = progress.categoryPerformance.findIndex(
      cp => cp.category === category
    );

    if (categoryIndex > -1) {
      const cp = progress.categoryPerformance[categoryIndex];
      cp.totalAttempts += 1;
      cp.totalCorrect += correctCount;
      cp.totalQuestions += totalQuestions;
      cp.averageScore = Math.round((cp.totalCorrect / cp.totalQuestions) * 100);
    } else {
      progress.categoryPerformance.push({
        category,
        totalAttempts: 1,
        averageScore: score,
        totalCorrect: correctCount,
        totalQuestions
      });
    }

    // Calculate overall accuracy
    const totalCorrect = progress.categoryPerformance.reduce((sum, cp) => sum + cp.totalCorrect, 0);
    const totalQs = progress.categoryPerformance.reduce((sum, cp) => sum + cp.totalQuestions, 0);
    progress.overallAccuracy = Math.round((totalCorrect / totalQs) * 100);
    progress.lastUpdated = Date.now();

    await progress.save();
  }
};

/**
 * @desc    Get user's attempts
 * @route   GET /api/attempts
 * @access  Private
 */
const getUserAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('quizId', 'title category difficulty');

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single attempt by ID
 * @route   GET /api/attempts/:id
 * @access  Private
 */
const getAttemptById = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quizId', 'title category difficulty');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    // Check ownership
    if (attempt.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this attempt'
      });
    }

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { submitAttempt, getUserAttempts, getAttemptById };