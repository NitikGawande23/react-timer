import React, { useState } from 'react';

function TimerForm({ addTimer }) {
  const [secondsInput, setSecondsInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const secs = parseInt(secondsInput);
    if (!isNaN(secs) && secs > 0) {
      addTimer(secs);
      setSecondsInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="number"
        placeholder="Enter seconds"
        value={secondsInput}
        onChange={(e) => setSecondsInput(e.target.value)}
        className="border px-3 py-1 mr-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Add Timer</button>
    </form>
  );
}

export default TimerForm;

