const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

/**
 * @desc    Create new quiz
 * @route   POST /api/quizzes
 * @access  Private (Owner only)
 */
const createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions } = req.body;

    // Check for duplicate quiz by same owner
    const existingQuiz = await Quiz.findOne({
      title: title.trim(),
      createdBy: req.user.id
    });

    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: 'You already have a quiz with this title'
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      questions,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all quizzes with filters
 * @route   GET /api/quizzes
 * @access  Private
 */
const getQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    
    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name')
      .select('-questions')
      .sort({ createdAt: -1 });

    // Get user's attempted quiz IDs to prevent duplicates
    const attemptedQuizIds = await Attempt.distinct('quizId', { userId: req.user.id });

    // Mark quizzes as attempted
    const quizzesWithAttemptStatus = quizzes.map(quiz => ({
      ...quiz.toObject(),
      isAttempted: attemptedQuizIds.some(id => id.toString() === quiz._id.toString()),
      questionCount: quiz.questions?.length || 0
    }));

    res.status(200).json({
      success: true,
      count: quizzesWithAttemptStatus.length,
      data: quizzesWithAttemptStatus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single quiz by ID
 * @route   GET /api/quizzes/:id
 * @access  Private
 */
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user has already attempted this quiz
    const existingAttempt = await Attempt.findOne({
      userId: req.user.id,
      quizId: quiz._id
    });

    res.status(200).json({
      success: true,
      data: {
        ...quiz.toObject(),
        isAttempted: !!existingAttempt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get quizzes created by owner
 * @route   GET /api/quizzes/my-quizzes
 * @access  Private (Owner only)
 */
const getMyQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    // Get attempt counts for each quiz
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const attemptCount = await Attempt.countDocuments({ quizId: quiz._id });
        return {
          ...quiz.toObject(),
          attemptCount,
          questionCount: quiz.questions.length
        };
      })
    );

    res.status(200).json({
      success: true,
      count: quizzesWithStats.length,
      data: quizzesWithStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private (Owner only)
 */
const updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz'
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (Owner only)
 */
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz'
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get quiz attempts
 * @route   GET /api/quizzes/:id/attempts
 * @access  Private (Owner only)
 */
const getQuizAttempts = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view attempts for this quiz'
      });
    }

    const attempts = await Attempt.find({ quizId: quiz._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  getMyQuizzes, 
  updateQuiz, 
  deleteQuiz, 
  getQuizAttempts 
};