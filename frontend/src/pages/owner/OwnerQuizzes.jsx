import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { toast } from 'react-toastify';

const OwnerQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizService.getMyQuizzes();
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await quizService.deleteQuiz(id);
      toast.success('Quiz deleted successfully');
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  const handleViewAttempts = (id) => {
    navigate(`/owner/attempts/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading your quizzes...</div>;
  }

  return (
    <div className="owner-quizzes">
      <div className="page-header">
        <h1>My Quizzes</h1>
        <button className="btn-primary" onClick={() => navigate('/owner/create')}>
          + Create New Quiz
        </button>
      </div>

      {quizzes.length > 0 ? (
        <div className="quizzes-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Questions</th>
                <th>Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(quiz => (
                <tr key={quiz._id}>
                  <td>{quiz.title}</td>
                  <td>{quiz.category}</td>
                  <td>
                    <span className={`badge ${quiz.difficulty.toLowerCase()}`}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td>{quiz.questionCount}</td>
                  <td>{quiz.attemptCount}</td>
                  <td className="actions">
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/owner/edit/${quiz._id}`)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(quiz._id, quiz.title)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-quizzes">
          <p>You haven't created any quizzes yet.</p>
          <button className="btn-primary" onClick={() => navigate('/owner/create')}>
            Create Your First Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default OwnerQuizzes;
