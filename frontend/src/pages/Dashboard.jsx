import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressService } from '../services/progressService';
import { quizService } from '../services/quizService';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import QuizCard from '../components/QuizCard';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchQuizzes();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await progressService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await quizService.getQuizzes();
      // Show only first 6 quizzes on dashboard
      setQuizzes(response.data.slice(0, 6));
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setQuizzesLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn-primary" onClick={() => navigate('/quizzes')}>
          Browse Quizzes
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon quizzes">Q</div>
          <div className="stat-content">
            <h3>{stats?.totalAttempts || 0}</h3>
            <p>Quizzes Attempted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon score">S</div>
          <div className="stat-content">
            <h3>{stats?.averageScore || 0}%</h3>
            <p>Average Score</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon accuracy">A</div>
          <div className="stat-content">
            <h3>{stats?.accuracy || 0}%</h3>
            <p>Accuracy</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon correct">C</div>
          <div className="stat-content">
            <h3>{stats?.totalCorrect || 0}/{stats?.totalQuestions || 0}</h3>
            <p>Correct Answers</p>
          </div>
        </div>
      </div>

      {stats?.recentAttempts?.length > 0 && (
        <div className="recent-attempts">
          <h2>Recent Attempts</h2>
          <div className="attempts-list">
            {stats.recentAttempts.map((attempt) => (
              <div key={attempt._id} className="attempt-item">
                <div className="attempt-info">
                  <h4>{attempt.quizTitle}</h4>
                  <p>{attempt.category} • {attempt.difficulty}</p>
                </div>
                <div className="attempt-score">
                  <span className="score">{attempt.score}%</span>
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate(`/result/${attempt._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Quizzes Section */}
      <div className="featured-quizzes">
        <div className="section-header">
          <h2>Featured Quizzes</h2>
          <button className="btn-secondary" onClick={() => navigate('/quizzes')}>
            View All Quizzes
          </button>
        </div>
        
        {quizzesLoading ? (
          <div className="quiz-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton skeleton-stat-card"></div>
            ))}
          </div>
        ) : quizzes.length > 0 ? (
          <div className="quiz-grid">
            {quizzes.map(quiz => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="no-quizzes">
            <p>No quizzes available at the moment.</p>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <button className="action-btn" onClick={() => navigate('/progress')}>
          <span className="action-icon">P</span>
          View Progress
        </button>
        <button className="action-btn" onClick={() => navigate('/analysis')}>
          <span className="action-icon">A</span>
          AI Analysis
        </button>
        <button className="action-btn" onClick={() => navigate('/about')}>
          <span className="action-icon">T</span>
          About Us
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
