import React from 'react';

const Timer = ({ timeLeft, formatTime }) => {
  const getTimerColor = () => {
    if (timeLeft < 60) return '#f44336'; // Red for last minute
    if (timeLeft < 300) return '#ff9800'; // Orange for last 5 minutes
    return '#4caf50'; // Green
  };

  return (
    <div className="timer" style={{ color: getTimerColor() }}>
      <span className="timer-icon">⏱️</span>
      <span className="timer-text">{formatTime()}</span>
    </div>
  );
};

export default Timer;
