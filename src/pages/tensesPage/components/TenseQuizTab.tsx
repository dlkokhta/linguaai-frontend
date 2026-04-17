import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { TENSES_QUIZ } from "../../../data/tensesQuiz";
import type { Tense } from "../../../data/tenses";

interface Props {
  tense: Tense;
}

type Screen = "quiz" | "result";

export const TenseQuizTab = ({ tense }: Props) => {
  const questions = TENSES_QUIZ[tense.id] ?? [];

  const [screen, setScreen] = useState<Screen>("quiz");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No quiz questions available.</p>
      </div>
    );
  }

  const current = questions[currentIndex];
  const isCorrect = input.trim().toLowerCase() === current.answer.toLowerCase();

  const handleCheck = () => {
    if (!input.trim()) return;
    if (isCorrect) setScore((s) => s + 1);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setScreen("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setInput("");
      setSubmitted(false);
    }
  };

  const restart = () => {
    setScreen("quiz");
    setCurrentIndex(0);
    setInput("");
    setSubmitted(false);
    setScore(0);
  };

  const renderTemplate = (template: string, answer: string, revealed: boolean) => {
    const parts = template.split("___");
    return (
      <span>
        {parts[0]}
        {revealed ? (
          <span className={`font-semibold px-1 ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
            {answer}
          </span>
        ) : (
          <span className="inline-block border-b-2 border-gray-400 dark:border-gray-500 w-28 mx-1 align-bottom" />
        )}
        {parts[1]}
      </span>
    );
  };

  if (screen === "result") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center space-y-5">
        <div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{score} / {questions.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {score === questions.length
              ? "Perfect! You've mastered this tense."
              : score >= 2
              ? "Good job! Keep practicing."
              : "Keep going — practice makes perfect!"}
          </p>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${(score / questions.length) * 100}%` }}
          />
        </div>
        <button
          onClick={restart}
          className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <RotateCcw size={15} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{currentIndex + 1} / {questions.length}</span>
          <span>{score} correct</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Fill in the blank
          </p>
          <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
            {renderTemplate(current.template, current.answer, submitted)}
          </p>
        </div>

        {!submitted ? (
          <div className="space-y-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="Type your answer…"
              className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500"
              autoFocus
            />
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className="cursor-pointer w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl disabled:opacity-60 transition-all"
            >
              Check
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`flex items-start gap-2 p-3 rounded-xl ${
              isCorrect
                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}>
              <p className={`text-sm font-medium ${isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {isCorrect
                  ? "Correct!"
                  : `Not quite. The answer is: ${current.answer}`}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="cursor-pointer w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all"
            >
              {currentIndex + 1 >= questions.length ? "See Results" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
