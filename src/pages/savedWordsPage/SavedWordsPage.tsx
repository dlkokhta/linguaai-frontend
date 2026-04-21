import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ChevronDown, ChevronUp, Search, Trash2, Volume2 } from "lucide-react";
import { SpeakPractice } from "../../components/SpeakPractice";
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

export const SavedWordsPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedExamples, setRevealedExamples] = useState<Record<string, Set<number>>>({});
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

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
        setWords(wordsRes.data);
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

  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`/saved-words/${id}`);
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleExample = (wordId: string, index: number) => {
    setRevealedExamples((prev) => {
      const set = new Set(prev[wordId] ?? []);
      if (set.has(index)) set.delete(index);
      else set.add(index);
      return { ...prev, [wordId]: set };
    });
  };

  const toggleExamples = (wordId: string) => {
    setExpandedWords((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
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

            <div className="flex items-center gap-2 mb-2">
              <Bookmark size={18} className="text-emerald-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Saved Words</h1>
              <span className="ml-auto text-xs text-gray-400">{words.length} word{words.length !== 1 ? "s" : ""}</span>
            </div>

            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            ) : (
            <>
            {words.length > 0 && (
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search words…"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
            )}

            {words.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                <Bookmark size={28} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">No saved words yet.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Go to Translate Word and save ones you like.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {words.filter((w) =>
                  w.word.toLowerCase().includes(search.toLowerCase()) ||
                  w.translation.toLowerCase().includes(search.toLowerCase())
                ).length === 0 && search ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">No words matching "{search}"</p>
                  </div>
                ) : null}
                {words.filter((w) =>
                  w.word.toLowerCase().includes(search.toLowerCase()) ||
                  w.translation.toLowerCase().includes(search.toLowerCase())
                ).map((w) => (
                  <div key={w.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">

                    {/* Word header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{w.word}</p>
                          <button
                            type="button"
                            onClick={() => speakText(w.word)}
                            className="cursor-pointer p-1 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                            title="Listen"
                          >
                            <Volume2 size={14} />
                          </button>
                          <SpeakPractice text={w.word} />
                        </div>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{w.translation}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(w.id)}
                        className="cursor-pointer p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Examples toggle */}
                    {w.examples.length > 0 && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => toggleExamples(w.id)}
                          className="cursor-pointer flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {expandedWords.has(w.id) ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          Examples ({w.examples.length})
                        </button>

                        {expandedWords.has(w.id) && (
                          <div className="mt-2 space-y-2">
                            {w.examples.map((ex, i) => (
                              <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3">
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
                                      onClick={() => toggleExample(w.id, i)}
                                      className="cursor-pointer px-2 py-1 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                      {revealedExamples[w.id]?.has(i) ? "Hide" : "Translate"}
                                    </button>
                                  </div>
                                </div>
                                {revealedExamples[w.id]?.has(i) && (
                                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-emerald-400 pl-3">
                                    {ex.ka}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
            </>
            )}

          </main>
        </div>

        <ProfileRightSidebar />

      </div>
    </div>
  );
};
