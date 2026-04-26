import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { ROUTES } from "../../../constants";
import type { Mode, SavedWord } from "../VocabularyQuizPage";

interface Props {
  allWords: SavedWord[];
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onStart: () => void;
}

export const VocabQuizSetup = ({ allWords, mode, onModeChange, onStart }: Props) => {
  const navigate = useNavigate();

  const recentCount = allWords.filter(
    (w) => Date.now() - new Date(w.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  if (allWords.length < 4) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <BookOpen size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">You need at least 4 saved words to start a quiz.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            You have {allWords.length} — save {4 - allWords.length} more.
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

  const modes: { id: Mode; label: string; desc: string; disabled: boolean }[] = [
    { id: "all", label: "All words", desc: `${allWords.length} word${allWords.length !== 1 ? "s" : ""}`, disabled: false },
    { id: "random10", label: "10 random", desc: "Quick session", disabled: allWords.length < 10 },
    { id: "recent", label: "Recent (last 7 days)", desc: `${recentCount} word${recentCount !== 1 ? "s" : ""}`, disabled: recentCount < 4 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Choose quiz mode</p>
        <div className="space-y-2">
          {modes.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && onModeChange(item.id)}
              disabled={item.disabled}
              className={`cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                mode === item.id
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className={`text-sm font-medium ${mode === item.id ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                {item.label}
              </span>
              <span className="text-xs text-gray-400">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onStart}
        className="cursor-pointer w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all"
      >
        Start Quiz
      </button>
    </div>
  );
};
