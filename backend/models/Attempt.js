const mongoose = require('mongoose');

const selectedAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOption: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  aiExplanation: {
    type: String,
    default: null
  }
});

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  quizTitle: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  selectedAnswers: [selectedAnswerSchema],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctCount: {
    type: Number,
    required: true,
    min: 0
  },
  wrongCount: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate attempts
attemptSchema.index({ userId: 1, quizId: 1, createdAt: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);
