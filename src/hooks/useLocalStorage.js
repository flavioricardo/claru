import { useState, useCallback } from 'react';

// Abstração do localStorage (DevFE v1.1 §5) — facilita migração p/ IndexedDB (v1.1)
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch (e) {
          console.error('localStorage write failed', e);
        }
        return resolved;
      });
    },
    [key]
  );
  return [value, set];
}
