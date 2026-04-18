export type PomodoroModeKey = "micro" | "classic" | "deep";

export interface PomodoroMode {
  key: PomodoroModeKey;
  label: string;
  focusMinutes: number;
  breakMinutes: number;
}

export const POMODORO_MODES: Record<PomodoroModeKey, PomodoroMode> = {
  micro: { key: "micro", label: "Micro", focusMinutes: 15, breakMinutes: 3 },
  classic: { key: "classic", label: "Classic", focusMinutes: 25, breakMinutes: 5 },
  deep: { key: "deep", label: "Deep", focusMinutes: 50, breakMinutes: 10 },
};

export const DEFAULT_POMODORO_MODE: PomodoroModeKey = "classic";

export const POMODORO_CYCLES_BEFORE_LONG_BREAK = 4;
