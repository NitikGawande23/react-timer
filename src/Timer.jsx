import React, { useState, useEffect, useRef } from "react";

const Timer = ({ id, name, initialSeconds, onDelete }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="timer-card">
      <h2>{name}</h2>
      <div className="timer-time">{formatTime(secondsLeft)}</div>
      <div className="timer-buttons">
        <button className="timer-btn" onClick={toggleTimer}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <span className="trash-icon" onClick={() => onDelete(id)}>🗑️</span>
      </div>
    </div>
  );
};

export default Timer;





