import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import TimerForm from "./TimerForm";
import "./App.css";

function App() {
  const [timers, setTimers] = useState([]);
  const [msg, setMsg] = useState("Loading...");

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
    <div className="app-container">
      <h1 className="main-heading">Countdown Timers</h1>
      <TimerForm addTimer={addTimer} />
      {timers.map(timer => (
        <Timer
          key={timer.id}
          id={timer.id}
          name={timer.name}
          totalSeconds={timer.totalSeconds}
          isRunning={timer.isRunning}
          deleteTimer={deleteTimer}
          externalToggleTimer={toggleTimer}
          updateSeconds={updateSeconds}
        />
      ))}
      <div className="cloud-msg">
        <h2>Vercel Cloud Function Demo</h2>
        <p>Message from cloud: {msg}</p>
      </div>
    </div>
  );
}

export default App;

