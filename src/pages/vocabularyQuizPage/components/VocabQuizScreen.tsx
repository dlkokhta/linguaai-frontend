import type { QuizQuestion } from "../VocabularyQuizPage";

interface Props {
  question: QuizQuestion;
  currentIndex: number;
  total: number;
  score: number;
  selected: string | null;
  onSelect: (option: string) => void;
  onNext: () => void;
}

export const VocabQuizScreen = ({ question, currentIndex, total, score, selected, onSelect, onNext }: Props) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{currentIndex + 1} / {total}</span>
          <span>{score} correct</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            What is the English word for?
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {question.correct.translation}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => {
            const isCorrect = option === question.correct.word;
            const isSelected = option === selected;
            let style = "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10";
            if (selected !== null) {
              if (isCorrect) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
              else if (isSelected) style = "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
              else style = "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 opacity-50";
            }
            return (
              <button
                key={option}
                onClick={() => onSelect(option)}
                disabled={selected !== null}
                className={`cursor-pointer w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${style} disabled:cursor-default`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="flex items-center justify-between pt-1">
            <p className={`text-sm font-medium ${selected === question.correct.word ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              {selected === question.correct.word
                ? "Correct!"
                : `Correct answer: ${question.correct.word}`}
            </p>
            <button
              onClick={onNext}
              className="cursor-pointer px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all"
            >
              {currentIndex + 1 >= total ? "See Results" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
