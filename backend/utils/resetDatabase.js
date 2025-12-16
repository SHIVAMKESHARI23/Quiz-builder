const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Progress = require('../models/Progress');

dotenv.config();

const sampleQuiz = {
  title: 'Welcome to Quiz Builder - Tutorial Quiz',
  description: 'This sample quiz will help you understand how to attempt quizzes, review questions, and see your results with AI-powered explanations.',
  category: 'General Knowledge',
  difficulty: 'Easy',
  timeLimit: 5,
  isSample: true,
  questions: [
    {
      questionText: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2
    },
    {
      questionText: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1
    },
    {
      questionText: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1
    },
    {
      questionText: 'Which programming language is known for web development?',
      options: ['Python', 'JavaScript', 'C++', 'Java'],
      correctAnswer: 1
    },
    {
      questionText: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Home Tool Markup Language',
        'Hyperlinks and Text Markup Language'
      ],
      correctAnswer: 0
    }
  ]
};

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Delete all existing data
    console.log('Deleting all existing data...');
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Attempt.deleteMany({});
    await Progress.deleteMany({});
    console.log('✓ All data deleted');

    // Create sample owner user
    console.log('Creating sample owner account...');
    const owner = await User.create({
      name: 'Sample Owner',
      email: 'owner@example.com',
      password: 'password123',
      role: 'owner'
    });
    console.log('✓ Sample owner created');
    console.log('  Email: owner@example.com');
    console.log('  Password: password123');

    // Create sample quiz
    console.log('Creating sample quiz...');
    await Quiz.create({
      ...sampleQuiz,
      createdBy: owner._id
    });
    console.log('✓ Sample quiz created');

    console.log('\n========================================');
    console.log('Database reset successfully!');
    console.log('========================================');
    console.log('\nYou can now login with:');
    console.log('  Email: owner@example.com');
    console.log('  Password: password123');
    console.log('\nThe database contains:');
    console.log('  - 1 Owner account');
    console.log('  - 1 Sample quiz (5 questions)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();
