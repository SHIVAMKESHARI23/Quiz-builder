const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v.length === 4;
      },
      message: 'Each question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['Mathematics', 'Science', 'History', 'Geography', 'Technology', 'Programming', 'General Knowledge', 'Other']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  timeLimit: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: [1, 'Time limit must be at least 1 minute'],
    max: [180, 'Time limit cannot exceed 180 minutes']
  },
  questions: {
    type: [questionSchema],
    required: [true, 'Questions are required'],
    validate: {
      validator: function(v) {
        return v.length >= 1;
      },
      message: 'Quiz must have at least 1 question'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isSample: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
quizSchema.index({ category: 1, difficulty: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
