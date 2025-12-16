import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { progressService } from '../services/progressService';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, progressRes] = await Promise.all([
        progressService.getScoreHistory(),
        progressService.getUserProgress()
      ]);
      setHistory(historyRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading progress...</div>;
  }

  const chartData = {
    labels: history.map(h => `Attempt ${h.attemptNumber}`),
    datasets: [
      {
        label: 'Score (%)',
        data: history.map(h => h.score),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Score Progress Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="progress-page">
      <h1>Your Progress</h1>

      {history.length > 0 ? (
        <>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="progress-stats">
            <h2>Overall Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{progress?.totalQuizzesAttempted || 0}</h3>
                <p>Total Quizzes</p>
              </div>
              <div className="stat-card">
                <h3>{progress?.overallAccuracy || 0}%</h3>
                <p>Overall Accuracy</p>
              </div>
            </div>
          </div>

          {progress?.categoryPerformance?.length > 0 && (
            <div className="category-performance">
              <h2>Category-wise Performance</h2>
              <div className="category-list">
                {progress.categoryPerformance.map((cat, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <h4>{cat.category}</h4>
                      <p>{cat.totalAttempts} attempts</p>
                    </div>
                    <div className="category-score">
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${cat.averageScore}%` }}
                        ></div>
                      </div>
                      <span>{cat.averageScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="no-data">
          <p>No quiz attempts yet. Start taking quizzes to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default Progress;
