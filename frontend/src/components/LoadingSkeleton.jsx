import React from 'react';

export const QuizCardSkeleton = () => (
  <div className="quiz-card skeleton">
    <div className="skeleton-header"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-button"></div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <div className="skeleton-stats">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-stat-card"></div>
      ))}
    </div>
  </div>
);
