"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // ignore malformed stored data, fall back to initialValue
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, isLoaded]);

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof updater === "function"
        ? (updater as (prev: T) => T)(prev)
        : updater
    );
  }, []);

  return [value, update] as const;
}
