import { useState, useEffect } from "react";

// Like useState, but remembers its value in the browser (localStorage).
export function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private window or blocked storage: the app still works, it just won't remember */
    }
  }, [key, value]);
  return [value, setValue];
}
