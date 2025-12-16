import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quizService';
import QuizCard from '../components/QuizCard';
import { QuizCardSkeleton } from '../components/LoadingSkeleton';
import { toast } from 'react-toastify';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    difficulty: 'All',
    search: ''
  });

  const categories = ['All', 'Mathematics', 'Science', 'History', 'Geography', 
                      'Technology', 'Programming', 'General Knowledge', 'Other'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.category !== 'All') filterParams.category = filters.category;
      if (filters.difficulty !== 'All') filterParams.difficulty = filters.difficulty;
      if (filters.search) filterParams.search = filters.search;

      const response = await quizService.getQuizzes(filterParams);
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="quiz-list-page">
      <h1>Available Quizzes</h1>

      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search quizzes..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />

        <select name="category" value={filters.category} onChange={handleFilterChange}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
          {difficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>

      <div className="quiz-grid">
        {loading ? (
          <>
            <QuizCardSkeleton />
            <QuizCardSkeleton />
            <QuizCardSkeleton />
          </>
        ) : quizzes.length > 0 ? (
          quizzes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)
        ) : (
          <div className="no-quizzes">
            <p>No quizzes found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
