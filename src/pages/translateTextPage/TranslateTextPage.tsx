import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2, Volume2 } from "lucide-react";
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

export const TranslateTextPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setTranslation(null);
    try {
      const res = await axiosInstance.post<{ translation: string }>("/translate/text", { text: text.trim() });
      setTranslation(res.data.translation);
    } catch {
      setError("Failed to translate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (content: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
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
    <div className="min-h-screen flex flex-col lg:flex-row dark:bg-gray-900">

      <ProfileLeftSidebar
        onLogout={handleLogout}
        profile={profile ?? { firstname: null, lastname: null, email: "", role: "REGULAR", picture: null }}
        getInitials={getInitials}
      />

      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

            <div className="mb-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Translate Text</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Paste or type any English text to get a Georgian translation.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
              <form onSubmit={handleTranslate} className="space-y-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your English text here…"
                  rows={5}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500 resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 text-sm rounded-xl font-medium disabled:opacity-60 transition-all"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                    {loading ? "Translating…" : "Translate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText(text)}
                    disabled={!text.trim()}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-40 transition-colors"
                  >
                    <Volume2 size={15} />
                    Listen (EN)
                  </button>
                </div>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {translation && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Georgian Translation</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {translation}
                </p>
              </div>
            )}

          </main>
        </div>

        <ProfileRightSidebar />
      </div>
    </div>
  );
};
