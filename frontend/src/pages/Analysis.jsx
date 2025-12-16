import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { toast } from 'react-toastify';

const Analysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const response = await aiService.getAnalysis();
      setAnalysis(response.data);
    } catch (error) {
      toast.error('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Generating AI analysis...</div>;
  }

  return (
    <div className="analysis-page">
      <h1>🧠 AI-Powered Analysis</h1>

      <div className="analysis-card">
        <h2>Your Performance Analysis</h2>
        <p className="analysis-text">{analysis.analysis}</p>
      </div>

      {analysis.strengths?.length > 0 && (
        <div className="strengths-section">
          <h2>💪 Your Strengths</h2>
          <div className="performance-grid">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="performance-card strength">
                <h3>{strength.category}</h3>
                <div className="performance-stats">
                  <div className="stat">
                    <span className="stat-value">{strength.accuracy || strength.averageScore}%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{strength.attempts}</span>
                    <span className="stat-label">Attempts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.weaknesses?.length > 0 && (
        <div className="weaknesses-section">
          <h2>📚 Areas for Improvement</h2>
          <div className="performance-grid">
            {analysis.weaknesses.map((weakness, index) => (
              <div key={index} className="performance-card weakness">
                <h3>{weakness.category}</h3>
                <div className="performance-stats">
                  <div className="stat">
                    <span className="stat-value">{weakness.accuracy || weakness.averageScore}%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{weakness.attempts}</span>
                    <span className="stat-label">Attempts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.categoryPerformance?.length > 0 && (
        <div className="all-categories">
          <h2>All Categories</h2>
          <div className="category-table">
            {analysis.categoryPerformance.map((cat, index) => (
              <div key={index} className="table-row">
                <span className="category-name">{cat.category}</span>
                <span className="category-accuracy">{cat.accuracy || cat.averageScore}%</span>
                <span className="category-attempts">{cat.attempts} attempts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
