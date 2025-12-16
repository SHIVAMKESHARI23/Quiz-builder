import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { toast } from 'react-toastify';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General Knowledge',
    difficulty: 'Easy',
    timeLimit: 10,
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });

  const categories = ['Mathematics', 'Science', 'History', 'Geography', 
                      'Technology', 'Programming', 'General Knowledge', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length === 1) {
      toast.error('Quiz must have at least one question');
      return;
    }
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Question ${i + 1}, Option ${j + 1} is required`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      await quizService.createQuiz(formData);
      toast.success('Quiz created successfully!');
      navigate('/owner/quizzes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz">
      <h1>Create New Quiz</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Quiz Details</h2>
          
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter quiz title"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter quiz description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty *</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Time Limit (minutes) *</label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                required
                min="1"
                max="180"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Questions</h2>
          
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="question-header">
                <h3>Question {qIndex + 1}</h3>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Question Text *</label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  required
                  placeholder="Enter question"
                />
              </div>

              <div className="options-grid">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="form-group">
                    <label>Option {oIndex + 1} *</label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                      placeholder={`Enter option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Correct Answer *</label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', parseInt(e.target.value))}
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
            </div>
          ))}

          <button type="button" className="btn-add" onClick={addQuestion}>
            + Add Question
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/owner/quizzes')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
