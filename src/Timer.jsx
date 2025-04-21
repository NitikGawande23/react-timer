import React, { useEffect, useState } from "react";

function Timer({ id, name, totalSeconds, isRunning, deleteTimer, externalToggleTimer, updateSeconds }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [startTime, setStartTime] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const updated = prev - 1;
          updateSeconds(id, updated);
          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      const endTime = new Date();
      const duration = Math.floor((endTime - startTime) / 1000);

      const payload = { taskName: name, startTime, endTime, duration };

      fetch('/api/saveSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(data => console.log("Session saved:", data))
        .catch(err => console.error("Error saving session:", err));
    }
  }, [timeLeft, isRunning]);

  const handleToggle = () => {
    if (!hasStarted) {
      setStartTime(new Date());
      setHasStarted(true);
    }
    externalToggleTimer(id);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="timer-card">
      <h2>{name}</h2>
      <div className="timer-time">{formatTime(timeLeft)}</div>
      <div className="timer-buttons">
        <button onClick={handleToggle} className={`timer-btn ${isRunning ? 'pause' : 'start'}`}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => deleteTimer(id)} className="timer-btn delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default Timer;

