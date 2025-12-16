import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-badge easy';
      case 'Medium': return 'difficulty-badge medium';
      case 'Hard': return 'difficulty-badge hard';
      default: return 'difficulty-badge';
    }
  };

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <h3>{quiz.title}</h3>
        <span className={getDifficultyClass(quiz.difficulty)}>
          {quiz.difficulty}
        </span>
      </div>
      
      <p className="quiz-description">{quiz.description}</p>
      
      <div className="quiz-meta">
        <span className="meta-item">📁 {quiz.category}</span>
        <span className="meta-item">⏱️ {quiz.timeLimit} min</span>
        <span className="meta-item">❓ {quiz.questionCount || quiz.questions?.length} questions</span>
      </div>
      
      {quiz.isAttempted ? (
        <button className="btn-disabled" disabled>
          ✓ Already Attempted
        </button>
      ) : (
        <button 
          className="btn-primary"
          onClick={() => navigate(`/quiz/${quiz._id}`)}
        >
          Start Quiz
        </button>
      )}
    </div>
  );
};

export default QuizCard;
