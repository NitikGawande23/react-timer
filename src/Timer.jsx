import React, { useEffect, useState } from 'react';

const formatTime = (totalSeconds) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

function Timer({ id, totalSeconds, isRunning, deleteTimer, toggleTimer, updateSeconds }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          updateSeconds(id, newTime);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return (
    <div className="timer-container">
      <p className="timer-display">{formatTime(timeLeft)}</p>
      <div className="timer-controls">
        <button
          onClick={() => toggleTimer(id)}
          className={`timer-toggle-btn ${isRunning ? 'pause' : 'start'}`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="timer-delete-btn" onClick={() => deleteTimer(id)}>🗑️</button>
      </div>
    </div>
  );
}

export default Timer;
