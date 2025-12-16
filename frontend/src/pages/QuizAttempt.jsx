import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { attemptService } from '../services/attemptService';
import { useTimer } from '../hooks/useTimer';
import Timer from '../components/Timer';
import { toast } from 'react-toastify';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting quiz...');
    handleSubmit();
  };

  const timer = useTimer(quiz?.timeLimit || 10, handleTimeUp);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await quizService.getQuizById(id);
      
      if (response.data.isAttempted) {
        toast.error('You have already attempted this quiz');
        navigate('/quizzes');
        return;
      }

      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(null));
      setMarkedForReview(new Array(response.data.questions.length).fill(false));
      timer.start();
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleMarkForReview = () => {
    const newMarked = [...markedForReview];
    newMarked[currentQuestion] = !newMarked[currentQuestion];
    setMarkedForReview(newMarked);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a === null).length;
    
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    timer.pause();

    try {
      const selectedAnswers = answers.map((answer, index) => ({
        selectedOption: answer !== null ? answer : 0
      }));

      const timeTaken = (quiz.timeLimit * 60) - timer.timeLeft;

      const response = await attemptService.submitAttempt({
        quizId: id,
        selectedAnswers,
        timeTaken
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/result/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
      timer.start();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  const question = quiz.questions[currentQuestion];
  const attemptedCount = answers.filter(a => a !== null).length;
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-attempt">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{quiz.title}</h1>
          <p>{quiz.category} • {quiz.difficulty}</p>
        </div>
        <Timer timeLeft={timer.timeLeft} formatTime={timer.formatTime} />
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-stats">
        <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
        <span>Attempted: {attemptedCount}/{quiz.questions.length}</span>
      </div>

      <div className="question-container">
        <h2 className="question-text">{question.questionText}</h2>
        
        <div className="options">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <span className="option-label">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>

        <div className="question-actions">
          <button
            className={`btn-mark ${markedForReview[currentQuestion] ? 'marked' : ''}`}
            onClick={handleMarkForReview}
          >
            {markedForReview[currentQuestion] ? '✓ Marked' : '🔖 Mark for Review'}
          </button>
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button className="btn-primary" onClick={handleNext}>
            Next →
          </button>
        )}
      </div>

      <div className="question-navigator">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            className={`nav-btn ${index === currentQuestion ? 'active' : ''} 
                       ${answers[index] !== null ? 'answered' : ''} 
                       ${markedForReview[index] ? 'marked' : ''}`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizAttempt;
