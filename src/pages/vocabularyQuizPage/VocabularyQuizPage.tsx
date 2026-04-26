import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { axiosInstance } from "../../context/AuthContext";
import { VocabQuizSetup } from "./components/VocabQuizSetup";
import { VocabQuizScreen } from "./components/VocabQuizScreen";
import { VocabQuizResult } from "./components/VocabQuizResult";

export interface SavedWord {
  id: string;
  word: string;
  translation: string;
  examples: { en: string; ka: string }[];
  createdAt: string;
}

export interface QuizQuestion {
  correct: SavedWord;
  options: string[];
}

export type Mode = "all" | "random10" | "recent";
type Screen = "setup" | "quiz" | "result";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function filterByMode(words: SavedWord[], mode: Mode): SavedWord[] {
  if (mode === "random10") return shuffle(words).slice(0, 10);
  if (mode === "recent") {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return shuffle(words.filter((w) => new Date(w.createdAt).getTime() >= cutoff));
  }
  return shuffle(words);
}

function buildQuestions(deck: SavedWord[], allWords: SavedWord[]): QuizQuestion[] {
  return deck.map((correct) => {
    const distractors = shuffle(allWords.filter((w) => w.id !== correct.id))
      .slice(0, 3)
      .map((w) => w.word);
    const options = shuffle([correct.word, ...distractors]);
    return { correct, options };
  });
}

export const VocabularyQuizPage = () => {
  const [screen, setScreen] = useState<Screen>("setup");
  const [mode, setMode] = useState<Mode>("all");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrongWords, setWrongWords] = useState<SavedWord[]>([]);

  const { data: allWords = [], isLoading } = useQuery({
    queryKey: ["saved-words"],
    queryFn: () => axiosInstance.get<SavedWord[]>("/saved-words").then((r) => r.data),
  });

  const startQuiz = () => {
    const deck = filterByMode(allWords, mode);
    setQuestions(buildQuestions(deck, allWords));
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setWrongWords([]);
    setScreen("quiz");
  };

  const handleSelect = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === questions[currentIndex].correct.word) {
      setScore((s) => s + 1);
    } else {
      setWrongWords((prev) => [...prev, questions[currentIndex].correct]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setScreen("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setScreen("setup");
    setSelected(null);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Vocabulary Quiz</h1>
        </div>

        {isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {!isLoading && screen === "setup" && (
          <VocabQuizSetup
            allWords={allWords}
            mode={mode}
            onModeChange={setMode}
            onStart={startQuiz}
          />
        )}

        {screen === "quiz" && currentQuestion && (
          <VocabQuizScreen
            question={currentQuestion}
            currentIndex={currentIndex}
            total={questions.length}
            score={score}
            selected={selected}
            onSelect={handleSelect}
            onNext={handleNext}
          />
        )}

        {screen === "result" && (
          <VocabQuizResult
            score={score}
            total={questions.length}
            wrongWords={wrongWords}
            onRestart={restart}
          />
        )}

      </main>
    </div>
  );
};
