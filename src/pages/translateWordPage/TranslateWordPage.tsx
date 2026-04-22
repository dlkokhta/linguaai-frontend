import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Languages, Loader2, Volume2 } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { ProfileLeftSidebar } from "../profilePage/components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "../profilePage/components/ProfileRightSidebar";
import { Toast } from "../../components/Toast";

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

interface TranslationResult {
  word: string;
  translation: string;
  examples: { en: string; ka: string }[];
}

export const TranslateWordPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [word, setWord] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedExamples, setRevealedExamples] = useState<Set<number>>(new Set());
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/user/me");
        setProfile(res.data);
      } catch {
        navigate(ROUTES.Login);
      }
    };
    fetchProfile();
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

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setRevealedExamples(new Set());
    setSavedId(null);
    try {
      const res = await axiosInstance.post<TranslationResult>("/translate/word", { word: word.trim() });
      setResult(res.data);
    } catch {
      setError("Failed to translate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExample = (index: number) => {
    setRevealedExamples((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      if (savedId) {
        await axiosInstance.delete(`/saved-words/${savedId}`);
        setSavedId(null);
      } else {
        const res = await axiosInstance.post<{ id: string }>("/saved-words", {
          word: result.word,
          translation: result.translation,
          examples: result.examples,
        });
        setSavedId(res.data.id);
        setToast("Word saved!");
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen flex flex-col xl:flex-row dark:bg-gray-900">

      <ProfileLeftSidebar
        onLogout={handleLogout}
        profile={profile ?? { firstname: null, lastname: null, email: "", role: "REGULAR", picture: null }}
        getInitials={getInitials}
      />

      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

            <div className="mb-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Translate Word</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Enter an English word to get its Georgian translation and examples.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
              <form onSubmit={handleTranslate} className="flex gap-3">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g. eloquent, curious, journey…"
                  className="flex-1 px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={loading || !word.trim()}
                  className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 text-sm rounded-xl font-medium disabled:opacity-60 transition-all shrink-0"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Languages size={14} />}
                  {loading ? "Translating…" : "Translate"}
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-4">

                {/* Translation */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.word}</p>
                    <p className="text-lg text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{result.translation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakText(result.word)}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                    >
                      <Volume2 size={15} />
                      Listen
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${
                        savedId
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Bookmark size={15} className={savedId ? "fill-current" : ""} />
                      {savedId ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Example Sentences</p>
                  <ol className="space-y-2">
                    {result.examples.map((ex, i) => (
                      <li key={i} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{ex.en}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => speakText(ex.en)}
                              className="cursor-pointer p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                              title="Listen"
                            >
                              <Volume2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleExample(i)}
                              className="cursor-pointer px-2 py-1 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              {revealedExamples.has(i) ? "Hide" : "Translate"}
                            </button>
                          </div>
                        </div>
                        {revealedExamples.has(i) && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-emerald-400 pl-3">
                            {ex.ka}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

              </div>
            )}

          </main>
        </div>

        <ProfileRightSidebar />
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};
