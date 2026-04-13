import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
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

type Mode = "all" | "random10" | "recent";
type Screen = "setup" | "quiz" | "result";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function filterByMode(words: SavedWord[], mode: Mode): SavedWord[] {
  if (mode === "random10") return shuffle(words).slice(0, 10);
  if (mode === "recent") {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = words.filter((w) => new Date(w.createdAt).getTime() >= cutoff);
    return shuffle(recent);
  }
  return shuffle(words);
}

export const VocabularyQuizPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allWords, setAllWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);

  // quiz state
  const [screen, setScreen] = useState<Screen>("setup");
  const [mode, setMode] = useState<Mode>("all");
  const [deck, setDeck] = useState<SavedWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
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
    const filtered = filterByMode(allWords, mode);
    setDeck(filtered);
    setCurrentIndex(0);
    setScore(0);
    setRevealed(false);
    setScreen("quiz");
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    if (currentIndex + 1 >= deck.length) {
      setScreen("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setRevealed(false);
    }
  };

  const restart = () => {
    setScreen("setup");
    setRevealed(false);
  };

  const currentWord = deck[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex dark:bg-gray-900">

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
                {allWords.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">You have no saved words yet.</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Go to Translate Word, translate some words and save them first.
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
                          { id: "all", label: "All words", desc: `${allWords.length} word${allWords.length !== 1 ? "s" : ""}` },
                          { id: "random10", label: "10 random", desc: "Quick session", disabled: allWords.length < 2 },
                          { id: "recent", label: "Recent (last 7 days)", desc: `${allWords.filter(w => Date.now() - new Date(w.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length} word${allWords.filter(w => Date.now() - new Date(w.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length !== 1 ? "s" : ""}` },
                        ] as const).map((item) => {
                          const isDisabled = item.id === "random10" && allWords.length < 2;
                          const recentCount = allWords.filter(w => Date.now() - new Date(w.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;
                          const isRecentEmpty = item.id === "recent" && recentCount === 0;
                          return (
                            <button
                              key={item.id}
                              onClick={() => !isDisabled && !isRecentEmpty && setMode(item.id)}
                              disabled={isDisabled || isRecentEmpty}
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
                          );
                        })}
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
            {screen === "quiz" && currentWord && (
              <div className="space-y-4">

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{currentIndex + 1} / {deck.length}</span>
                    <span>{score} correct</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${((currentIndex) / deck.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">What is the English word for?</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentWord.translation}</p>
                  </div>

                  {!revealed ? (
                    <button
                      onClick={() => setRevealed(true)}
                      className="cursor-pointer px-6 py-2.5 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                    >
                      Reveal Answer
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-6 py-4 border border-gray-100 dark:border-gray-700">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{currentWord.word}</p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => handleAnswer(false)}
                          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-200 dark:border-red-800"
                        >
                          <XCircle size={16} />
                          Missed
                        </button>
                        <button
                          onClick={() => handleAnswer(true)}
                          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all border border-emerald-200 dark:border-emerald-800"
                        >
                          <CheckCircle2 size={16} />
                          Got it
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Result screen ── */}
            {screen === "result" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center space-y-5">
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{score} / {deck.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {score === deck.length
                      ? "Perfect score! Outstanding!"
                      : score >= deck.length * 0.8
                      ? "Great job! Keep it up!"
                      : score >= deck.length * 0.5
                      ? "Good effort! Keep practicing."
                      : "Keep going, practice makes perfect!"}
                  </p>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${(score / deck.length) * 100}%` }}
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
