import { useNavigate } from "react-router-dom";
import { Layers, BookMarked, Sparkles, Trophy, CalendarClock, CheckCircle2 } from "lucide-react";
import { ROUTES } from "../../../constants";
import type { FlashcardStats } from "../FlashcardsPage";

interface Props {
  stats: FlashcardStats | undefined;
  isPending: boolean;
  starting: boolean;
  error: string | null;
  onStart: () => void;
}

export const FlashcardsStart = ({ stats, isPending, starting, error, onStart }: Props) => {
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!stats) return null;

  if (stats.total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <Layers size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your deck is empty — every word and sentence you save becomes a flashcard.
          </p>
          <button
            onClick={() => navigate(ROUTES.TranslateWord)}
            className="cursor-pointer mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            Go to Translate Word
          </button>
        </div>
      </div>
    );
  }

  const tiles = [
    { label: "Due today", value: stats.due, icon: <CalendarClock size={18} className="text-emerald-500" /> },
    { label: "New", value: stats.new, icon: <Sparkles size={18} className="text-sky-500" /> },
    { label: "Learned", value: stats.learned, icon: <Trophy size={18} className="text-amber-500" /> },
    { label: "Total cards", value: stats.total, icon: <BookMarked size={18} className="text-gray-400" /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            {tile.icon}
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{tile.value}</p>
              <p className="text-xs text-gray-400">{tile.label}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center" role="alert">{error}</p>
      )}

      {stats.due > 0 ? (
        <button
          onClick={onStart}
          disabled={starting}
          className="cursor-pointer w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all disabled:opacity-60 disabled:cursor-wait"
        >
          {starting
            ? "Loading cards..."
            : `Start review (${stats.due} card${stats.due !== 1 ? "s" : ""})`}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">All caught up — nothing due today!</p>
        </div>
      )}
    </div>
  );
};
