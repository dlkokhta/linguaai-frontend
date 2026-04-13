import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2, Volume2 } from "lucide-react";
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

interface SavedSentence {
  id: string;
  en: string;
  ka: string;
  topic: string;
  createdAt: string;
}

export const SavedSentencesPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sentences, setSentences] = useState<SavedSentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedTranslations, setRevealedTranslations] = useState<Set<string>>(new Set());

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
        const sentencesRes = await axiosInstance.get<SavedSentence[]>("/saved-sentences");
        setSentences(sentencesRes.data);
      } catch {
        // saved sentences failed, show empty state
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
    await axiosInstance.delete(`/saved-sentences/${id}`);
    setSentences((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleTranslation = (id: string) => {
    setRevealedTranslations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
              <Bookmark size={18} className="text-emerald-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Saved Sentences</h1>
              <span className="ml-auto text-xs text-gray-400">{sentences.length} sentence{sentences.length !== 1 ? "s" : ""}</span>
            </div>

            {sentences.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                <Bookmark size={28} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">No saved sentences yet.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Go to Generate Sentences and save ones you like.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
                <ol className="space-y-3">
                  {sentences.map((s) => (
                    <li key={s.id} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{s.en}</p>
                          <span className="inline-block mt-1 text-[11px] text-gray-400 bg-gray-100 dark:bg-gray-700 dark:text-gray-500 rounded-full px-2 py-0.5">
                            {s.topic}
                          </span>
                          <div className="flex items-center gap-1.5 mt-2">
                            <button
                              type="button"
                              onClick={() => speakText(s.en)}
                              className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                            >
                              <Volume2 size={13} />
                              Listen
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleTranslation(s.id)}
                              className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              {revealedTranslations.has(s.id) ? "Hide" : "Translate"}
                            </button>
                          </div>
                          {revealedTranslations.has(s.id) && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-emerald-400 pl-3">
                              {s.ka}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="cursor-pointer p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

          </main>
        </div>

        <ProfileRightSidebar />

      </div>
    </div>
  );
};
