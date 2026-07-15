import { RotateCcw } from "lucide-react";
import type { GradeCounts } from "../FlashcardsPage";

interface Props {
  counts: GradeCounts;
  onRestart: () => void;
}

export const FlashcardsSummary = ({ counts, onRestart }: Props) => {
  const total = counts.again + counts.good + counts.easy;

  const message =
    counts.again === 0
      ? "Perfect session — you remembered everything!"
      : counts.again <= counts.good + counts.easy
        ? "Well done! The tricky cards will come back sooner."
        : "Keep going — repetition is how they stick.";

  const rows = [
    { label: "Again", value: counts.again, color: "text-red-500" },
    { label: "Good", value: counts.good, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Easy", value: counts.easy, color: "text-sky-600 dark:text-sky-400" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center space-y-5">
      <div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{total}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          card{total !== 1 ? "s" : ""} reviewed
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{message}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <p className={`text-lg font-bold ${row.color}`}>{row.value}</p>
            <p className="text-xs text-gray-400">{row.label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all"
      >
        <RotateCcw size={15} />
        Back to overview
      </button>
    </div>
  );
};
