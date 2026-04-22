import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export interface TensePracticeQuestion {
  tense: string;
  label: string;
  ka: string;
  en: string;
  hints: string[];
  options: string[];
}

interface Props {
  question: TensePracticeQuestion;
  questionNumber: number;
  total: number;
  mode: "word-bank" | "typing";
  onNext: () => void;
}

const normalize = (s: string) => s.toLowerCase().replace(/[.!?,;:'"]/g, "").trim();

const NextButton = ({ onNext, isLast }: { onNext: () => void; isLast: boolean }) => (
  <div className="flex justify-center">
    <button
      type="button"
      onClick={onNext}
      className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 text-sm rounded-xl font-medium transition-all"
    >
      {isLast ? "Finish Practice" : "Next Question"}
      <ChevronRight size={16} />
    </button>
  </div>
);

const WordBankMode = ({
  question,
  isLast,
  onNext,
}: {
  question: TensePracticeQuestion;
  isLast: boolean;
  onNext: () => void;
}) => {
  const expected = question.en.split(/\s+/);
  const [assembled, setAssembled] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setAssembled([]);
    setUsedIndices(new Set());
    setWrongWord(null);
    setBlocked(false);
    setDone(false);
  }, [question]);

  const handleClick = (word: string, idx: number) => {
    if (blocked || done) return;
    const expectedWord = expected[assembled.length];
    if (normalize(word) === normalize(expectedWord)) {
      const next = [...assembled, word];
      setAssembled(next);
      setUsedIndices((prev) => new Set([...prev, idx]));
      if (next.length === expected.length) setDone(true);
    } else {
      setWrongWord(word);
      setBlocked(true);
      setTimeout(() => {
        setWrongWord(null);
        setBlocked(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Assembly area */}
      <div className="min-h-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 flex flex-wrap gap-1.5 items-center">
        {assembled.length === 0 ? (
          <span className="text-sm text-gray-400">Your sentence will appear here...</span>
        ) : (
          assembled.map((w, i) => (
            <span
              key={i}
              className={`text-sm font-medium ${
                done ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {w}
            </span>
          ))
        )}
      </div>

      {wrongWord && (
        <div
          data-testid="wrong-word-feedback"
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5 text-sm text-red-600 dark:text-red-400"
        >
          "<span className="font-semibold">{wrongWord}</span>" doesn't come next. Try another word.
        </div>
      )}

      {done ? (
        <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">Correct!</p>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {question.options.map((word, i) => {
            const used = usedIndices.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleClick(word, i)}
                disabled={blocked || used}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  used
                    ? "invisible"
                    : wrongWord === word
                    ? "cursor-pointer bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                    : "cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-50"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}

      {done && <NextButton onNext={onNext} isLast={isLast} />}
    </div>
  );
};

const TypingMode = ({
  question,
  isLast,
  onNext,
}: {
  question: TensePracticeQuestion;
  isLast: boolean;
  onNext: () => void;
}) => {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [diff, setDiff] = useState<{ word: string; ok: boolean }[]>([]);

  useEffect(() => {
    setValue("");
    setChecked(false);
    setCorrect(false);
    setDiff([]);
  }, [question]);

  const handleCheck = () => {
    const expectedWords = question.en.split(/\s+/).map(normalize);
    const userWords = value.trim().split(/\s+/).map(normalize);
    const isCorrect = expectedWords.join(" ") === userWords.join(" ");
    setCorrect(isCorrect);
    setChecked(true);

    const maxLen = Math.max(expectedWords.length, userWords.length);
    setDiff(
      Array.from({ length: maxLen }, (_, i) => {
        const exp = expectedWords[i];
        const usr = userWords[i];
        if (!usr) return { word: `(${exp} missing)`, ok: false };
        return { word: usr, ok: usr === exp };
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Hints */}
      <div className="flex flex-wrap gap-2">
        {question.hints.map((hint, i) => (
          <span
            key={i}
            className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 font-medium"
          >
            {hint}
          </span>
        ))}
      </div>

      {!checked ? (
        <>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && value.trim()) { e.preventDefault(); handleCheck(); } }}
            placeholder="Type the English translation..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={!value.trim()}
            className="cursor-pointer w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all"
          >
            Check
          </button>
        </>
      ) : (
        <div className="space-y-3">
          {correct ? (
            <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">Correct!</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Not quite. Your answer:</p>
              <div className="flex flex-wrap gap-1.5">
                {diff.map((d, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-sm font-medium ${
                      d.ok
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {d.word}
                  </span>
                ))}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Correct answer:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{question.en}</p>
              </div>
            </div>
          )}
          <NextButton onNext={onNext} isLast={isLast} />
        </div>
      )}
    </div>
  );
};

export const TensePracticeQuestion = ({ question, questionNumber, total, mode, onNext }: Props) => {
  const progressPct = ((questionNumber - 1) / total) * 100;
  const isLast = questionNumber === total;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Question {questionNumber} of {total}</span>
          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
            {question.label}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Georgian sentence */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Translate to English:</p>
        <p className="text-base font-medium text-gray-800 dark:text-gray-200">{question.ka}</p>
      </div>

      {mode === "word-bank" ? (
        <WordBankMode question={question} isLast={isLast} onNext={onNext} />
      ) : (
        <TypingMode question={question} isLast={isLast} onNext={onNext} />
      )}
    </div>
  );
};
