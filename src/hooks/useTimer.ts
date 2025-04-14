import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
  time: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const useTimer = (): UseTimerReturn => {
  const [time, setTime] = useState<number>(0); // Store the current time
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store reference to the interval ID

  // Start the timer
  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1); // Increment time every second
      }, 1000);
    }
  };

  // Stop the timer
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Reset the timer
  const resetTimer = () => {
    setTime(0);
  };

  // Clean up the interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    time,
    startTimer,
    stopTimer,
    resetTimer
  };
};

export default useTimer;
