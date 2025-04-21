import React, { useEffect, useState } from 'react';

const formatTime = (totalSeconds) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

function Timer({ id, name, totalSeconds, isRunning, deleteTimer, toggleTimer, updateSeconds }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [startTime, setStartTime] = useState(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [originalDuration, setOriginalDuration] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(totalSeconds);
    setStartTime(null);
    setHasSaved(false);
    setOriginalDuration(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      if (!startTime) setStartTime(new Date());

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

  useEffect(() => {
    if (timeLeft === 0 && isRunning && !hasSaved && startTime) {
      const endTime = new Date();

      fetch('/api/saveSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          startTime,
          endTime,
          duration: originalDuration
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('✅ Session saved:', data);
          setHasSaved(true);
        })
        .catch(err => {
          console.error('❌ Failed to save session:', err);
        });
    }
  }, [timeLeft, isRunning, hasSaved, startTime, name, originalDuration]);

  return (
    <div className="timer-container mb-4 p-3 border rounded">
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="timer-display text-lg mb-2">{formatTime(timeLeft)}</p>
      <div className="timer-controls flex gap-2">
        <button
          onClick={() => toggleTimer(id)}
          className={`px-3 py-1 rounded text-white ${isRunning ? 'bg-yellow-500' : 'bg-green-500'}`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => deleteTimer(id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default Timer;


