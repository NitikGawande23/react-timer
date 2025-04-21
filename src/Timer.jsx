import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

function Timer({ timer, onRemove }) {
  const [remaining, setRemaining] = useState(timer.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval = null;

    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && remaining === 0) {
      clearInterval(interval);
      setIsRunning(false);
      saveSession();
    }

    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const formatTime = (sec) => {
    const hrs = String(Math.floor(sec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const secs = String(sec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(new Date().toISOString());
      setIsRunning(true);
    }
  };

  const saveSession = async () => {
    try {
      const res = await fetch('/api/saveSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskName: timer.taskName,
          start: startTime,
          end: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      console.log("✅ Session saved:", data);
    } catch (error) {
      console.error("❌ Error saving session:", error);
    }
  };

  return (
    <div className="bg-white border border-rose-400 shadow-md rounded-xl p-6 w-80 flex flex-col gap-4 relative">
      <div className="text-lg font-bold text-neutral-800">{timer.taskName}</div>
      <div className="text-3xl font-extrabold text-[#3c0000] text-center">
        {formatTime(remaining)}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded"
          onClick={handleStart}
        >
          Start
        </button>
        <Trash2
          className="text-gray-400 hover:text-rose-500 cursor-pointer"
          onClick={() => onRemove(timer.id)}
        />
      </div>
    </div>
  );
}

export default Timer;


