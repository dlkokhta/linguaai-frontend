import { useState } from "react";
import { Trophy } from "lucide-react";
import { axiosInstance } from "../../context/AuthContext";
import { QuizSetup } from "./components/QuizSetup";
import { QuizQuestion } from "./components/QuizQuestion";
import type { QuizLevel } from "./components/QuizSetup";
import type { QuizQuestion as QuizQuestionType } from "./components/QuizQuestion";

type Phase = "setup" | "quiz" | "complete";

export const TensesQuizPage = () => {
  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (tenseName: string, formula: string, whenToUse: string, level: QuizLevel) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post<{ questions: QuizQuestionType[] }>(
        "/generate/quiz",
        { tense: tenseName, formula, whenToUse, level }
      );
      const normalized = res.data.questions.map((q) => ({
        ...q,
        options: q.options.flatMap((o) => o.trim().split(/\s+/)),
      }));
      setQuestions(normalized);
      setCurrentIndex(0);
      setPhase("quiz");
    } catch {
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("complete");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setPhase("setup");
    setQuestions([]);
    setCurrentIndex(0);
    setError(null);
  };

  return (
    <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-5">

        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tenses Quiz</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {phase === "setup" && (
          <QuizSetup onStart={handleStart} loading={loading} />
        )}

        {phase === "quiz" && questions.length > 0 && (
          <QuizQuestion
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            total={questions.length}
            onNext={handleNext}
          />
        )}

        {phase === "complete" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center space-y-4">
            <Trophy size={48} className="text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quiz Complete!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Great work! You finished all {questions.length} questions.
            </p>
            <button
              type="button"
              onClick={handleRestart}
              className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 text-sm rounded-xl font-medium transition-all"
            >
              Start New Quiz
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
