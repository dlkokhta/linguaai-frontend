import { useEffect, useState } from "react";
import { Trash2, Undo2, Volume2 } from "lucide-react";
import { speakText } from "../../../utils/audio";
import type { Grade, QueueCard } from "../FlashcardsPage";

interface Props {
  card: QueueCard;
  currentIndex: number;
  total: number;
  submitting: boolean;
  error: string | null;
  onGrade: (grade: Grade) => void;
  onSuspend: () => void;
  canUndo: boolean;
  onUndo: () => void;
}

const KEY_GRADES: Record<string, Grade> = {
  "1": "AGAIN",
  "2": "GOOD",
  "3": "EASY",
};

const formatInterval = (days: number) =>
  days === 0 ? "now" : days === 1 ? "1 day" : `${days} days`;

export const FlashcardsSession = ({
  card,
  currentIndex,
  total,
  submitting,
  error,
  onGrade,
  onSuspend,
  canUndo,
  onUndo,
}: Props) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.repeat || target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if (!revealed && e.code === "Space") {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed && !submitting && KEY_GRADES[e.key]) {
        onGrade(KEY_GRADES[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed, submitting, onGrade]);

  const front =
    card.cardType === "WORD" ? card.savedWord?.word
    : card.cardType === "SENTENCE" ? card.savedSentence?.en
    : card.front;
  const back =
    card.cardType === "WORD" ? card.savedWord?.translation
    : card.cardType === "SENTENCE" ? card.savedSentence?.ka
    : card.back;
  const examples = card.cardType === "WORD" ? card.savedWord?.examples ?? [] : [];
  const typeLabel = card.cardType === "WORD" ? "Word" : card.cardType === "SENTENCE" ? "Sentence" : "Card";

  const gradeButtons: { grade: Grade; label: string; interval: number; style: string }[] = [
    {
      grade: "AGAIN",
      label: "Again",
      interval: card.preview.again,
      style: "border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10",
    },
    {
      grade: "GOOD",
      label: "Good",
      interval: card.preview.good,
      style: "border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10",
    },
    {
      grade: "EASY",
      label: "Easy",
      interval: card.preview.easy,
      style: "border-sky-200 dark:border-sky-900/40 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{currentIndex + 1} / {total}</span>
          <div className="flex items-center gap-3">
            {canUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="cursor-pointer inline-flex items-center gap-1 hover:text-emerald-500 transition-colors"
              >
                <Undo2 size={12} />
                Undo
              </button>
            )}
            <span>{total - currentIndex - 1} left</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {typeLabel} — what does it mean?
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className={`font-bold text-gray-900 dark:text-white ${card.cardType === "SENTENCE" ? "text-xl" : "text-3xl"}`}>
              {front}
            </p>
            <button
              type="button"
              onClick={() => front && speakText(front)}
              className="cursor-pointer p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shrink-0"
              title="Listen"
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all"
          >
            Show answer
          </button>
        ) : (
          <>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-5 text-center space-y-4">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{back}</p>

              {examples.length > 0 && (
                <div className="space-y-2 text-left">
                  {examples.map((ex, i) => (
                    <div key={i} className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{ex.en}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ex.ka}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {gradeButtons.map(({ grade, label, interval, style }) => (
                <button
                  key={grade}
                  onClick={() => onGrade(grade)}
                  disabled={submitting}
                  className={`cursor-pointer px-2 py-2.5 rounded-xl border text-center transition-all disabled:opacity-50 disabled:cursor-wait ${style}`}
                >
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-[11px] opacity-70 mt-0.5">{formatInterval(interval)}</span>
                </button>
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center" role="alert">{error}</p>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={onSuspend}
                disabled={submitting}
                className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                <Trash2 size={13} />
                Remove from deck
              </button>
            </div>
          </>
        )}

        <p className="hidden sm:block text-center text-[11px] text-gray-400">
          {revealed ? "1 — Again · 2 — Good · 3 — Easy" : "Press Space to show the answer"}
        </p>
      </div>
    </div>
  );
};
