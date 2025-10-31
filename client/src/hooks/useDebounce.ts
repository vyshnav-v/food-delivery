import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing values
 * @template T - Type of value being debounced
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
