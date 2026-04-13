import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, RotateCcw } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { ProfileLeftSidebar } from "../profilePage/components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "../profilePage/components/ProfileRightSidebar";

interface UserProfile {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  role: "REGULAR" | "ADMIN";
  picture: string | null;
  method: string;
  createdAt: string;
  isTwoFactorEnabled: boolean;
}

interface SavedWord {
  id: string;
  word: string;
  translation: string;
  examples: { en: string; ka: string }[];
  createdAt: string;
}

interface QuizQuestion {
  correct: SavedWord;
  options: string[]; // 4 shuffled English words
}

type Mode = "all" | "random10" | "recent";
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
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allWords, setAllWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);

  const [screen, setScreen] = useState<Screen>("setup");
  const [mode, setMode] = useState<Mode>("all");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axiosInstance.get<UserProfile>("/user/me");
        setProfile(profileRes.data);
      } catch {
        navigate(ROUTES.Login);
        return;
      }
      try {
        const wordsRes = await axiosInstance.get<SavedWord[]>("/saved-words");
        setAllWords(wordsRes.data);
      } catch {
        // show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      setAccessToken(null);
      navigate(ROUTES.Login);
    }
  };

  const getInitials = () => {
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname[0]}${profile.lastname[0]}`.toUpperCase();
    }
    if (profile?.firstname) return profile.firstname[0].toUpperCase();
    if (profile?.email) return profile.email[0].toUpperCase();
    return "?";
  };

  const startQuiz = () => {
    const deck = filterByMode(allWords, mode);
    setQuestions(buildQuestions(deck, allWords));
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setScreen("quiz");
  };

  const handleSelect = (option: string) => {
    if (selected !== null) return; // already answered
    setSelected(option);
    if (option === questions[currentIndex].correct.word) {
      setScore((s) => s + 1);
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
  const recentCount = allWords.filter(
    (w) => Date.now() - new Date(w.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row dark:bg-gray-900">

      <ProfileLeftSidebar
        onLogout={handleLogout}
        profile={profile ?? { firstname: null, lastname: null, email: "", role: "REGULAR", picture: null }}
        getInitials={getInitials}
      />

      <div className="flex-1 lg:ml-56 flex min-h-screen">
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-emerald-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Vocabulary Quiz</h1>
            </div>

            {/* ── Setup screen ── */}
            {screen === "setup" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
                {allWords.length < 4 ? (
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
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Choose quiz mode</p>
                      <div className="space-y-2">
                        {([
                          { id: "all" as Mode, label: "All words", desc: `${allWords.length} word${allWords.length !== 1 ? "s" : ""}`, disabled: false },
                          { id: "random10" as Mode, label: "10 random", desc: "Quick session", disabled: allWords.length < 10 },
                          { id: "recent" as Mode, label: "Recent (last 7 days)", desc: `${recentCount} word${recentCount !== 1 ? "s" : ""}`, disabled: recentCount < 4 },
                        ]).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => !item.disabled && setMode(item.id)}
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
                      onClick={startQuiz}
                      className="cursor-pointer w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all"
                    >
                      Start Quiz
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── Quiz screen ── */}
            {screen === "quiz" && currentQuestion && (
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      What is the English word for?
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentQuestion.correct.translation}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options.map((option) => {
                      const isCorrect = option === currentQuestion.correct.word;
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
                          onClick={() => handleSelect(option)}
                          disabled={selected !== null}
                          className={`cursor-pointer w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${style} disabled:cursor-default`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next button — appears after selection */}
                  {selected !== null && (
                    <div className="flex items-center justify-between pt-1">
                      <p className={`text-sm font-medium ${selected === currentQuestion.correct.word ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                        {selected === currentQuestion.correct.word
                          ? "Correct!"
                          : `Correct answer: ${currentQuestion.correct.word}`}
                      </p>
                      <button
                        onClick={handleNext}
                        className="cursor-pointer px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all"
                      >
                        {currentIndex + 1 >= questions.length ? "See Results" : "Next"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Result screen ── */}
            {screen === "result" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center space-y-5">
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{score} / {questions.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {score === questions.length
                      ? "Perfect score! Outstanding!"
                      : score >= questions.length * 0.8
                      ? "Great job! Keep it up!"
                      : score >= questions.length * 0.5
                      ? "Good effort! Keep practicing."
                      : "Keep going, practice makes perfect!"}
                  </p>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={restart}
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
              </div>
            )}

          </main>
        </div>

        <ProfileRightSidebar />
      </div>
    </div>
  );
};
