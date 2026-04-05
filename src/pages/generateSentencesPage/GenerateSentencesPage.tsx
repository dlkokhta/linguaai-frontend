import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Languages, LayoutDashboard, Loader2, LogOut, Settings, Volume2, Wand2 } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";

const STORAGE_KEY = "linguaai_generated_sentences";

export const GenerateSentencesPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [topic, setTopic] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).topic ?? "" : "";
  });
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).difficulty ?? "intermediate" : "intermediate";
  });
  const [sentences, setSentences] = useState<{ en: string; ka: string }[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).sentences ?? [] : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedTranslations, setRevealedTranslations] = useState<Set<number>>(new Set());

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ topic, difficulty, sentences }));
  }, [topic, difficulty, sentences]);

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleTranslation = (index: number) => {
    setRevealedTranslations((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      setAccessToken(null);
      navigate(ROUTES.Login);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSentences([]);
    setRevealedTranslations(new Set());
    try {
      const res = await axiosInstance.post<{ sentences: { en: string; ka: string }[] }>("/generate/sentences", {
        topic,
        difficulty,
      });
      setSentences(res.data.sentences);
    } catch {
      setError("Failed to generate sentences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex lg:w-56 flex-col fixed inset-y-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">LinguaAI</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-1">Account</p>
            {[
              { label: "Overview", icon: <LayoutDashboard size={16} /> },
              { label: "Settings", icon: <Settings size={16} /> },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(ROUTES.Profile)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-1">Practice</p>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              <Wand2 size={16} />
              Generate Sentences
            </button>
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main + Right ── */}
      <div className="flex-1 lg:ml-56 flex min-h-screen">

        {/* Main */}
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">

        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">LinguaAI</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
            <LogOut size={15} />
            Logout
          </button>
        </header>

        <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

          <div className="mb-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Generate Sentences</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Enter a topic or keyword to get example sentences for practice.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Topic or keyword
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. travel, weather, food…"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 text-sm rounded-xl font-medium disabled:opacity-60 transition-all"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                {loading ? "Generating…" : "Generate Sentences"}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {sentences.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Generated Sentences</h2>
              <ol className="space-y-3">
                {sentences.map((s, i) => (
                  <li key={i} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{s.en}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={() => speakText(s.en)}
                            className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                            title="Listen"
                          >
                            <Volume2 size={13} />
                            Listen
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleTranslation(i)}
                            className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <Languages size={13} />
                            {revealedTranslations.has(i) ? "Hide" : "Translate"}
                          </button>
                        </div>
                        {revealedTranslations.has(i) && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-emerald-400 pl-3">
                            {s.ka}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

        </main>
        </div>

        {/* ── Right Sidebar (empty) ── */}
        <aside className="hidden xl:block w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />

      </div>
    </div>
  );
};
