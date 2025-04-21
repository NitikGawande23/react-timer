import React, { useEffect, useState } from "react";
import Timer from './Timer';
import TimerForm from './TimerForm';
import './index.css';
import './App.css'; // Assuming this is for Netlify demo styles

function App() {
  const [timers, setTimers] = useState([]);
  const [msg, setMsg] = useState("Loading..."); // 👈 Cloud function message

  // Cloud function fetch
  useEffect(() => {
    fetch("/.netlify/functions/hello")
      .then((res) => res.json())
      .then((data) => setMsg(data.message));
  }, []);

  const addTimer = (seconds, name) => {
    const newTimer = {
      id: Date.now(),
      totalSeconds: seconds,
      isRunning: false,
      name: name || "Unnamed Timer"
    };
    setTimers([...timers, newTimer]);
  };

  const deleteTimer = (id) => {
    setTimers(timers.filter(timer => timer.id !== id));
  };

  const toggleTimer = (id) => {
    setTimers(timers.map(timer =>
      timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
    ));
  };

  const updateSeconds = (id, newSeconds) => {
    setTimers(timers.map(timer =>
      timer.id === id ? { ...timer, totalSeconds: newSeconds } : timer
    ));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Countdown Timers</h1>
      <TimerForm addTimer={addTimer} />
      {timers.map(timer => (
        <Timer
          key={timer.id}
          id={timer.id}
          name={timer.name}
          totalSeconds={timer.totalSeconds}
          isRunning={timer.isRunning}
          deleteTimer={deleteTimer}
          toggleTimer={toggleTimer} // ⚠️ Class names preserved, just renamed this prop
          updateSeconds={updateSeconds}
        />
      ))}

      {/* Cloud function demo section */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Vercel Cloud Function Demo</h2>
        <p className="text-sm text-gray-600">Message from cloud: {msg}</p>
      </div>
    </div>
  );
}

export default App;






