import React, { useState } from "react";
import Timer from "./Timer";
import "./index.css";

const App = () => {
  const [timers, setTimers] = useState([]);
  const [name, setName] = useState("");
  const [seconds, setSeconds] = useState("");

  const addTimer = () => {
    if (name && seconds) {
      setTimers([...timers, { id: Date.now(), name, seconds: parseInt(seconds) }]);
      setName("");
      setSeconds("");
    }
  };

  const deleteTimer = (id) => {
    setTimers(timers.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>Countdown Timers</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTimer();
        }}
      >
        <input
          type="text"
          placeholder="Timer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Seconds"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {timers.map((timer) => (
        <Timer
          key={timer.id}
          id={timer.id}
          name={timer.name}
          initialSeconds={timer.seconds}
          onDelete={deleteTimer}
        />
      ))}
    </div>
  );
};

export default App;








