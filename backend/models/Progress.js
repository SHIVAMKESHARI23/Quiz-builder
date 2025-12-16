const mongoose = require('mongoose');

const categoryPerformanceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalCorrect: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  }
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalQuizzesAttempted: {
    type: Number,
    default: 0
  },
  overallAccuracy: {
    type: Number,
    default: 0
  },
  categoryPerformance: [categoryPerformanceSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
