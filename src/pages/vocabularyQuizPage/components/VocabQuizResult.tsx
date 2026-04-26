import { useNavigate } from "react-router-dom";
import { RotateCcw, Volume2 } from "lucide-react";
import { ROUTES } from "../../../constants";
import { speakText } from "../../../utils/audio";
import type { SavedWord } from "../VocabularyQuizPage";

interface Props {
  score: number;
  total: number;
  wrongWords: SavedWord[];
  onRestart: () => void;
}

export const VocabQuizResult = ({ score, total, wrongWords, onRestart }: Props) => {
  const navigate = useNavigate();

  const message =
    score === total ? "Perfect score! Outstanding!"
    : score >= total * 0.8 ? "Great job! Keep it up!"
    : score >= total * 0.5 ? "Good effort! Keep practicing."
    : "Keep going, practice makes perfect!";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center space-y-5">
      <div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{score} / {total}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{message}</p>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
          style={{ width: `${(score / total) * 100}%` }}
        />
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRestart}
          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <RotateCcw size={15} />
          Try Again
        </button>
        <button
          onClick={() => navigate(ROUTES.SavedWords)}
          className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all"
        >
          Saved Words
        </button>
      </div>

      {wrongWords.length > 0 && (
        <div className="text-left pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">
            Words to Review ({wrongWords.length})
          </p>
          <div className="space-y-2">
            {wrongWords.map((w) => (
              <div key={w.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{w.word}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{w.translation}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(w.word)}
                  className="cursor-pointer p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  title="Listen"
                >
                  <Volume2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
