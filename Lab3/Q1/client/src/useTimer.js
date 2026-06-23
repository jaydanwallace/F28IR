import { useState, useCallback } from "react";

// Tracks the total time the chatbot has spent responding across all questions.
export function useTimer() {
  const [total, setTotal] = useState(0);

  const addTime = useCallback((seconds) => {
    setTotal((prev) => prev + seconds);
  }, []);

  const reset = useCallback(() => setTotal(0), []);

  return { total, addTime, reset };
}
