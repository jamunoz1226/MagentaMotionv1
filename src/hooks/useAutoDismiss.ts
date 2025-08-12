import { useEffect, useRef, useState } from "react";

export interface AutoDismissOptions {
  minMs?: number; // inclusive lower bound
  maxMs?: number; // inclusive upper bound
  pauseOnHover?: boolean;
  enabled?: boolean;
}

/**
 * Returns {active, start, cancel, onMouseEnter, onMouseLeave}
 */
export function useAutoDismiss(onDismiss: () => void, options: AutoDismissOptions = {}) {
  const { minMs = 5000, maxMs = 7000, pauseOnHover = true, enabled = true } = options;
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(0);
  const endAtRef = useRef<number>(0);

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function schedule(duration: number) {
    clearTimer();
    endAtRef.current = Date.now() + duration;
    timerRef.current = window.setTimeout(() => {
      setActive(false);
      onDismiss();
    }, duration);
  }

  function start() {
    if (!enabled) return;
    const duration = Math.floor(minMs + Math.random() * Math.max(0, maxMs - minMs));
    setActive(true);
    schedule(duration);
  }

  function cancel() {
    setActive(false);
    clearTimer();
  }

  function onMouseEnter() {
    if (!pauseOnHover || !enabled || !timerRef.current) return;
    remainingRef.current = Math.max(0, endAtRef.current - Date.now());
    clearTimer();
  }

  function onMouseLeave() {
    if (!pauseOnHover || !enabled || active || remainingRef.current <= 0) return;
    schedule(remainingRef.current);
  }

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return { active, start, cancel, onMouseEnter, onMouseLeave } as const;
}
