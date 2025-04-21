import { useState } from 'react';
import Timer from './Timer';
import './App.css';

function App() {
  const [timers, setTimers] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [seconds, setSeconds] = useState('');

  const addTimer = () => {
    if (taskName && seconds) {
      setTimers([
        ...timers,
        { id: Date.now(), taskName, seconds: parseInt(seconds), startTime: null },
      ]);
      setTaskName('');
      setSeconds('');
    }
  };

  const removeTimer = (id) => {
    setTimers(timers.filter((timer) => timer.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#ede9dd] p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-rose-700 mb-6">Countdown Timers</h1>
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Timer name"
          className="border-2 rounded-md px-4 py-2 focus:outline-none"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Seconds"
          className="border-2 rounded-md px-4 py-2 focus:outline-none"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
        />
        <button
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md"
          onClick={addTimer}
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {timers.map((timer) => (
          <Timer
            key={timer.id}
            timer={timer}
            onRemove={removeTimer}
          />
        ))}
      </div>
    </div>
  );
}

export default App;


