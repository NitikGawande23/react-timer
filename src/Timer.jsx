import React, { useEffect, useState } from 'react';

const formatTime = (totalSeconds) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

function Timer({ id, name, totalSeconds, isRunning, deleteTimer, toggleTimer, updateSeconds }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [secondsPassed, setSecondsPassed] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setTimeLeft(totalSeconds);
    setSecondsPassed(0);
  }, [totalSeconds]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          updateSeconds(id, newTime);
          setSecondsPassed(prevPassed => prevPassed + 1);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning && !hasSaved) {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - secondsPassed * 1000);

      console.log("🎯 Timer finished, saving session...");
      console.log("⏱️ Seconds passed:", secondsPassed);

      fetch('/api/saveSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          startTime,
          endTime,
          duration: totalSeconds  // original input duration saved here
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
  }, [timeLeft, isRunning, secondsPassed, name, hasSaved, totalSeconds]);

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

