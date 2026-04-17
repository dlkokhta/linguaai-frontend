import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { ProfileLeftSidebar } from "../profilePage/components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "../profilePage/components/ProfileRightSidebar";
import { TENSES, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "../../data/tenses";
import { TenseLearnTab } from "./components/TenseLearnTab";
import { TensePracticeTab } from "./components/TensePracticeTab";

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

type Tab = "learn" | "practice" | "quiz";

const TABS: { id: Tab; label: string }[] = [
  { id: "learn",    label: "Learn"    },
  { id: "practice", label: "Practice" },
  { id: "quiz",     label: "Quiz"     },
];

export const TenseDetailPage = () => {
  const navigate = useNavigate();
  const { tenseId } = useParams<{ tenseId: string }>();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("learn");

  const tense = TENSES.find((t) => t.id === tenseId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/user/me");
        setProfile(res.data);
      } catch {
        navigate(ROUTES.Login);
      } finally {
        setLoading(false);
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

      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

            {/* Back button */}
            <button
              onClick={() => navigate(ROUTES.Tenses)}
              className="cursor-pointer flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={15} />
              All Tenses
            </button>

            {!tense ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tense not found.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{tense.name}</h1>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[tense.difficulty]}`}>
                    {DIFFICULTY_LABELS[tense.difficulty]}
                  </span>
                </div>

                {/* Tab bar */}
                <div className="flex gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`cursor-pointer flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === "learn" && <TenseLearnTab tense={tense} />}

                {activeTab === "practice" && <TensePracticeTab tense={tense} />}

                {activeTab === "quiz" && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quiz — coming soon</p>
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
