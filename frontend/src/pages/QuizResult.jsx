import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { aiService } from '../services/aiService';
import { toast } from 'react-toastify';

const QuizResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingExplanations, setLoadingExplanations] = useState(false);

  useEffect(() => {
    fetchAttempt();
  }, [id]);

  const fetchAttempt = async () => {
    try {
      const response = await attemptService.getAttemptById(id);
      setAttempt(response.data);
      
      // Load AI explanations for wrong answers
      loadExplanations(response.data);
    } catch (error) {
      toast.error('Failed to load results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadExplanations = async (attemptData) => {
    setLoadingExplanations(true);
    const updatedAnswers = [...attemptData.selectedAnswers];

    for (let i = 0; i < updatedAnswers.length; i++) {
      const answer = updatedAnswers[i];
      
      if (!answer.isCorrect && !answer.aiExplanation) {
        try {
          const response = await aiService.getExplanation({
            questionText: answer.questionText,
            options: answer.options,
            selectedOption: answer.selectedOption,
            correctAnswer: answer.correctAnswer
          });
          updatedAnswers[i].aiExplanation = response.data.explanation;
        } catch (error) {
          updatedAnswers[i].aiExplanation = 'Unable to generate explanation.';
        }
      }
    }

    setAttempt({ ...attemptData, selectedAnswers: updatedAnswers });
    setLoadingExplanations(false);
  };

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="quiz-result">
      <div className="result-header">
        <h1>Quiz Results</h1>
        <h2>{attempt.quizTitle}</h2>
      </div>

      <div className="result-summary">
        <div className="score-circle" style={{ borderColor: getScoreColor(attempt.score) }}>
          <span className="score-value">{attempt.score}%</span>
        </div>

        <div className="result-stats">
          <div className="stat">
            <span className="stat-label">Total Questions</span>
            <span className="stat-value">{attempt.totalQuestions}</span>
          </div>
          <div className="stat correct">
            <span className="stat-label">Correct</span>
            <span className="stat-value">{attempt.correctCount}</span>
          </div>
          <div className="stat wrong">
            <span className="stat-label">Wrong</span>
            <span className="stat-value">{attempt.wrongCount}</span>
          </div>
        </div>
      </div>

      <div className="answers-review">
        <h3>Answer Review</h3>
        
        {loadingExplanations && (
          <div className="loading-explanations">
            Loading AI explanations for wrong answers...
          </div>
        )}

        {attempt.selectedAnswers.map((answer, index) => (
          <div key={index} className={`answer-card ${answer.isCorrect ? 'correct' : 'wrong'}`}>
            <div className="answer-header">
              <span className="question-number">Question {index + 1}</span>
              <span className={`answer-status ${answer.isCorrect ? 'correct' : 'wrong'}`}>
                {answer.isCorrect ? '✓ Correct' : '✗ Wrong'}
              </span>
            </div>

            <p className="question-text">{answer.questionText}</p>

            <div className="answer-options">
              {answer.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`answer-option 
                    ${optIndex === answer.selectedOption ? 'selected' : ''} 
                    ${optIndex === answer.correctAnswer ? 'correct-answer' : ''}`}
                >
                  <span className="option-label">{String.fromCharCode(65 + optIndex)}</span>
                  <span className="option-text">{option}</span>
                  {optIndex === answer.correctAnswer && (
                    <span className="correct-badge">✓ Correct Answer</span>
                  )}
                  {optIndex === answer.selectedOption && optIndex !== answer.correctAnswer && (
                    <span className="wrong-badge">Your Answer</span>
                  )}
                </div>
              ))}
            </div>

            {!answer.isCorrect && answer.aiExplanation && (
              <div className="ai-explanation">
                <h4>🤖 AI Explanation</h4>
                <p>{answer.aiExplanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button className="btn-secondary" onClick={() => navigate('/quizzes')}>
          Browse More Quizzes
        </button>
        <button className="btn-primary" onClick={() => navigate('/progress')}>
          View Progress
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
