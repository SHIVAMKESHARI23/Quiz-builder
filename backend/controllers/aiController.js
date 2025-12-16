const OpenAI = require('openai');
const Attempt = require('../models/Attempt');

// Initialize OpenAI only if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * @desc    Generate AI explanation for wrong answer
 * @route   POST /api/ai/explain
 * @access  Private
 */
const generateExplanation = async (req, res, next) => {
  try {
    const { questionText, options, selectedOption, correctAnswer } = req.body;

    // Check if OpenAI is configured
    if (!openai) {
      return res.status(200).json({
        success: true,
        data: { 
          explanation: `The correct answer is "${options[correctAnswer]}". Your answer "${options[selectedOption]}" was incorrect. Review the question and the correct answer to understand the concept better. (Note: AI explanations require OpenAI API key configuration)`
        }
      });
    }

    const prompt = `
You are an educational AI assistant. A student answered a quiz question incorrectly.

Question: ${questionText}

Options:
${options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}

Student's Answer: Option ${selectedOption + 1} - ${options[selectedOption]}
Correct Answer: Option ${correctAnswer + 1} - ${options[correctAnswer]}

Please provide a clear, concise explanation (2-3 sentences) that:
1. Explains why the student's answer is incorrect
2. Explains why the correct answer is right
3. Helps the student understand the concept better

Keep it educational and encouraging.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    });

    const explanation = completion.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      data: { explanation }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(200).json({
      success: true,
      data: { 
        explanation: 'Unable to generate AI explanation at this time. Please review the correct answer and try to understand why it is correct.'
      }
    });
  }
};


/**
 * @desc    Generate strength and weakness analysis
 * @route   GET /api/ai/analysis
 * @access  Private
 */
const generateAnalysis = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id });

    if (attempts.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          analysis: 'No quiz attempts yet. Start taking quizzes to get personalized insights!',
          strengths: [],
          weaknesses: []
        }
      });
    }

    // Calculate category-wise performance
    const categoryStats = {};
    attempts.forEach(attempt => {
      if (!categoryStats[attempt.category]) {
        categoryStats[attempt.category] = {
          totalAttempts: 0,
          totalScore: 0,
          totalCorrect: 0,
          totalQuestions: 0
        };
      }
      categoryStats[attempt.category].totalAttempts++;
      categoryStats[attempt.category].totalScore += attempt.score;
      categoryStats[attempt.category].totalCorrect += attempt.correctCount;
      categoryStats[attempt.category].totalQuestions += attempt.totalQuestions;
    });

    // Calculate averages
    const categoryPerformance = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      averageScore: Math.round(stats.totalScore / stats.totalAttempts),
      accuracy: Math.round((stats.totalCorrect / stats.totalQuestions) * 100),
      attempts: stats.totalAttempts
    }));

    // Sort by accuracy
    categoryPerformance.sort((a, b) => b.accuracy - a.accuracy);

    const strengths = categoryPerformance.slice(0, 2);
    const weaknesses = categoryPerformance.slice(-2).reverse();

    // Check if OpenAI is configured
    if (!openai) {
      return res.status(200).json({
        success: true,
        data: {
          analysis: `Great progress! You're performing well in ${strengths[0]?.category || 'your strong areas'}. Keep practicing ${weaknesses[0]?.category || 'weaker areas'} to improve further. (Note: AI-powered insights require OpenAI API key configuration)`,
          strengths,
          weaknesses,
          categoryPerformance
        }
      });
    }

    // Generate AI analysis
    const prompt = `
Based on a student's quiz performance data:

Strengths:
${strengths.map(s => `- ${s.category}: ${s.accuracy}% accuracy (${s.attempts} attempts)`).join('\n')}

Weaknesses:
${weaknesses.map(w => `- ${w.category}: ${w.accuracy}% accuracy (${w.attempts} attempts)`).join('\n')}

Provide a brief, encouraging analysis (3-4 sentences) that:
1. Acknowledges their strengths
2. Identifies areas for improvement
3. Gives actionable study suggestions
4. Motivates them to keep learning

Keep it positive and constructive.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
      temperature: 0.7
    });

    const analysis = completion.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      data: {
        analysis,
        strengths,
        weaknesses,
        categoryPerformance
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback analysis without AI
    const attempts = await Attempt.find({ userId: req.user.id });
    const categoryStats = {};
    attempts.forEach(attempt => {
      if (!categoryStats[attempt.category]) {
        categoryStats[attempt.category] = { totalScore: 0, count: 0, totalCorrect: 0, totalQuestions: 0 };
      }
      categoryStats[attempt.category].totalScore += attempt.score;
      categoryStats[attempt.category].totalCorrect += attempt.correctCount;
      categoryStats[attempt.category].totalQuestions += attempt.totalQuestions;
      categoryStats[attempt.category].count++;
    });

    const categoryPerformance = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      averageScore: Math.round(stats.totalScore / stats.count),
      accuracy: Math.round((stats.totalCorrect / stats.totalQuestions) * 100),
      attempts: stats.count
    })).sort((a, b) => b.averageScore - a.averageScore);

    res.status(200).json({
      success: true,
      data: {
        analysis: 'Keep practicing to improve your skills across all categories!',
        strengths: categoryPerformance.slice(0, 2),
        weaknesses: categoryPerformance.slice(-2).reverse(),
        categoryPerformance
      }
    });
  }
};
module.exports = { generateExplanation, generateAnalysis };