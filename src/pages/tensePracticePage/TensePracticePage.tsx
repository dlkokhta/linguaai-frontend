import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { ProfileLeftSidebar } from "../profilePage/components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "../profilePage/components/ProfileRightSidebar";
import { TensePracticeSetup } from "./components/TensePracticeSetup";
import { TensePracticeQuestion } from "./components/TensePracticeQuestion";
import type { TensePracticeQuestion as TensePracticeQuestionType } from "./components/TensePracticeQuestion";

type Phase = "setup" | "practice" | "complete";
type Mode = "word-bank" | "typing";

export const TensePracticePage = () => {
  const navigate = useNavigate();
  const { setAccessToken, profile } = useAuth();

  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<TensePracticeQuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("word-bank");
  const [error, setError] = useState<string | null>(null);

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
    if (profile?.firstname && profile?.lastname)
      return `${profile.firstname[0]}${profile.lastname[0]}`.toUpperCase();
    if (profile?.firstname) return profile.firstname[0].toUpperCase();
    if (profile?.email) return profile.email[0].toUpperCase();
    return "?";
  };

  const handleStart = async (tenses: string[], topic: string, selectedMode: Mode) => {
    setLoading(true);
    setError(null);
    setMode(selectedMode);
    try {
      const res = await axiosInstance.post<{ questions: TensePracticeQuestionType[] }>(
        "/generate/tense-practice",
        { tenses, topic }
      );
      const shuffled = res.data.questions.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }));
      setQuestions(shuffled);
      setCurrentIndex(0);
      setPhase("practice");
    } catch {
      setError("Failed to generate practice. Please try again.");
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
    <div className="h-screen overflow-hidden flex flex-col xl:flex-row dark:bg-gray-900">
      <ProfileLeftSidebar
        onLogout={handleLogout}
        profile={profile}
        getInitials={getInitials}
      />

      <div className="flex-1 flex h-full overflow-hidden">
        <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-5">

            <div className="flex items-center gap-2">
              <PenLine size={18} className="text-emerald-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tense Practice</h1>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {phase === "setup" && (
              <TensePracticeSetup onStart={handleStart} loading={loading} />
            )}

            {phase === "practice" && questions.length > 0 && (
              <TensePracticeQuestion
                question={questions[currentIndex]}
                questionNumber={currentIndex + 1}
                total={questions.length}
                mode={mode}
                onNext={handleNext}
              />
            )}

            {phase === "complete" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center space-y-4">
                <PenLine size={48} className="text-emerald-500 mx-auto" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Practice Complete!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Great work! You practised {questions.length} tense{questions.length > 1 ? "s" : ""}.
                </p>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 text-sm rounded-xl font-medium transition-all"
                >
                  Start New Practice
                </button>
              </div>
            )}

          </main>
        </div>

        <ProfileRightSidebar />
      </div>
    </div>
  );
};
