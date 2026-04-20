import { POMODORO_MODES, type PomodoroModeKey } from "../constants/pomodoro";
import { usePomodoro } from "../context/PomodoroContext";

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PomodoroTimer = () => {
  const {
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
  } = usePomodoro();

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const phaseLabel =
    phase === "break" ? "Break" : phase === "focus" ? "Focus" : "Ready";

  const activeRingClass =
    phase === "break" ? "stroke-emerald-400" : "stroke-emerald-500";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">
          Focus Timer
        </p>
        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
          {completedCycles}/4 cycles
        </p>
      </div>

      <div className="flex justify-center mb-3">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className={activeRingClass}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-emerald-500">
              {phaseLabel}
            </p>
            <p className="text-2xl font-mono font-bold tabular-nums text-gray-800 dark:text-white">
              {formatTime(secondsLeft)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-3">
        {(Object.keys(POMODORO_MODES) as PomodoroModeKey[]).map((key) => {
          const isActive = modeKey === key;
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`cursor-pointer py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
              }`}
            >
              {POMODORO_MODES[key].label}
              <span className="block text-[9px] font-normal opacity-80">
                {POMODORO_MODES[key].focusMinutes}/
                {POMODORO_MODES[key].breakMinutes}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        {isRunning ? (
          <button
            onClick={pause}
            className="cursor-pointer flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={start}
            className="cursor-pointer flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors"
          >
            {phase === "idle" ? "Start" : "Resume"}
          </button>
        )}
        <button
          onClick={reset}
          className="cursor-pointer px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-white dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 text-sm font-semibold transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
