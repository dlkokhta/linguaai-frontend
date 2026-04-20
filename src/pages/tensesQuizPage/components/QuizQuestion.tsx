import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export interface QuizQuestion {
  display: string;
  options: string[];
  answers: string[];
  full: string;
}

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  total: number;
  onNext: () => void;
}

const speakText = (text: string) => {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
};

export const QuizQuestion = ({ question, questionNumber, total, onNext }: Props) => {
  const [filled, setFilled] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setFilled([]);
    setUsedIndices(new Set());
    setWrongWord(null);
    setBlocked(false);
    setDone(false);
  }, [question]);

  const handleWordClick = (word: string, optionIndex: number) => {
    if (blocked || done) return;

    const expected = question.answers[filled.length];
    if (word.toLowerCase() === expected.toLowerCase()) {
      speakText(word);
      const newFilled = [...filled, word];
      setFilled(newFilled);
      setUsedIndices((prev) => new Set([...prev, optionIndex]));
      if (newFilled.length === question.answers.length) {
        setTimeout(() => speakText(question.full), 600);
        setDone(true);
      }
    } else {
      setWrongWord(word);
      setBlocked(true);
      setTimeout(() => {
        setWrongWord(null);
        setBlocked(false);
      }, 1500);
    }
  };

  const parts = question.display.split("___");
  const progressPct = ((questionNumber - 1) / total) * 100;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Question {questionNumber} of {total}</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Sentence */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-base leading-loose text-gray-800 dark:text-gray-200 text-center">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                filled[i] !== undefined ? (
                  <span className="inline-block mx-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {filled[i]}
                  </span>
                ) : (
                  <span className="inline-block mx-1 w-14 border-b-2 border-gray-400 dark:border-gray-500 align-bottom" />
                )
              )}
            </span>
          ))}
        </p>
        {done && (
          <p className="mt-4 text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            Correct!
          </p>
        )}
      </div>

      {/* Wrong word feedback */}
      {wrongWord && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
          "<span className="font-semibold">{wrongWord}</span>" is not correct here. Try another word.
        </div>
      )}

      {/* Word bank */}
      {!done && (
        <div className="flex flex-wrap gap-2 justify-center">
          {question.options.map((word, i) => {
            if (usedIndices.has(i)) return null;
            const isWrong = wrongWord === word;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleWordClick(word, i)}
                disabled={blocked}
                className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  isWrong
                    ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-50"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}

      {/* Next button */}
      {done && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onNext}
            className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 text-sm rounded-xl font-medium transition-all"
          >
            {questionNumber === total ? "Finish Quiz" : "Next Question"}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
