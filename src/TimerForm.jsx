import React, { useState } from 'react';

function TimerForm({ addTimer }) {
  const [secondsInput, setSecondsInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const secs = parseInt(secondsInput);
    if (!isNaN(secs) && secs > 0) {
      addTimer(secs, nameInput.trim());
      setSecondsInput('');
      setNameInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Timer name"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        className="border px-3 py-1 mr-2 rounded"
      />
      <input
        type="number"
        placeholder="Seconds"
        value={secondsInput}
        onChange={(e) => setSecondsInput(e.target.value)}
        className="border px-3 py-1 mr-2 rounded w-24"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Add</button>
    </form>
  );
}

export default TimerForm;


