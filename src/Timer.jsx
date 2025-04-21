import React, { useEffect, useState } from 'react';

function Timer({ id, name, totalSeconds, isRunning, deleteTimer, externalToggleTimer, updateSeconds }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [startTime, setStartTime] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          updateSeconds(id, newTime);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      const endTime = new Date();
      const duration = Math.floor((endTime - startTime) / 1000);

      const payload = {
        taskName: name,
        startTime,
        endTime,
        duration,
      };

      fetch('/api/saveSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => console.log('Session saved:', data))
        .catch((err) => console.error('Error saving session:', err));
    }
  }, [timeLeft, isRunning, startTime, name]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleToggle = () => {
    if (!hasStarted) {
      setStartTime(new Date());
      setHasStarted(true);
    }
    externalToggleTimer(id);
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md mb-4">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-2xl font-mono mb-4">{formatTime(timeLeft)}</p>
      <div className="flex space-x-2">
        <button
          onClick={handleToggle}
          className={`px-3 py-1 rounded text-white ${isRunning ? 'bg-yellow-500' : 'bg-green-500'}`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => deleteTimer(id)}
          className="px-3 py-1 rounded bg-red-500 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Timer;



