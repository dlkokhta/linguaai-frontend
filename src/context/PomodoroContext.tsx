import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  DEFAULT_POMODORO_MODE,
  POMODORO_CYCLES_BEFORE_LONG_BREAK,
  POMODORO_MODES,
  type PomodoroModeKey,
} from "../constants/pomodoro";

export type PomodoroPhase = "idle" | "focus" | "break";

interface PomodoroContextType {
  modeKey: PomodoroModeKey;
  phase: PomodoroPhase;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  completedCycles: number;
  setMode: (key: PomodoroModeKey) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const getPhaseSeconds = (key: PomodoroModeKey, phase: PomodoroPhase) => {
  const mode = POMODORO_MODES[key];
  if (phase === "break") return mode.breakMinutes * 60;
  return mode.focusMinutes * 60;
};

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const [modeKey, setModeKey] = useState<PomodoroModeKey>(DEFAULT_POMODORO_MODE);
  const [phase, setPhase] = useState<PomodoroPhase>("idle");
  const [secondsLeft, setSecondsLeft] = useState<number>(
    getPhaseSeconds(DEFAULT_POMODORO_MODE, "focus")
  );
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds =
    phase === "break"
      ? POMODORO_MODES[modeKey].breakMinutes * 60
      : POMODORO_MODES[modeKey].focusMinutes * 60;

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const setMode = (key: PomodoroModeKey) => {
    clearTimer();
    setModeKey(key);
    setPhase("idle");
    setIsRunning(false);
    setCompletedCycles(0);
    setSecondsLeft(getPhaseSeconds(key, "focus"));
  };

  const start = () => {
    if (phase === "idle") setPhase("focus");
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    clearTimer();
    setIsRunning(false);
    setPhase("idle");
    setCompletedCycles(0);
    setSecondsLeft(getPhaseSeconds(modeKey, "focus"));
  };

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (phase === "focus") {
          const nextCycles = completedCycles + 1;
          setCompletedCycles(nextCycles);

          if (nextCycles >= POMODORO_CYCLES_BEFORE_LONG_BREAK) {
            setIsRunning(false);
            setPhase("idle");
            return getPhaseSeconds(modeKey, "focus");
          }

          setPhase("break");
          return getPhaseSeconds(modeKey, "break");
        }

        setPhase("focus");
        return getPhaseSeconds(modeKey, "focus");
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, phase, modeKey, completedCycles]);

  return (
    <PomodoroContext.Provider
      value={{
        modeKey,
        phase,
        secondsLeft,
        totalSeconds,
        isRunning,
        completedCycles,
        setMode,
        start,
        pause,
        reset,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
};
