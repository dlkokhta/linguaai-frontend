import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { ProfileLeftSidebar } from "../profilePage/components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "../profilePage/components/ProfileRightSidebar";
import { TENSES, TENSE_GROUPS, TenseGroup } from "../../data/tenses";
import { TenseCard } from "./components/TenseCard";

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

const GROUP_HEADER_COLORS: Record<TenseGroup, string> = {
  present: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  past:    "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  future:  "text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
};

export const TensesOverviewPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">

            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-emerald-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">English Tenses</h1>
            </div>

            {TENSE_GROUPS.map(({ label, value }) => {
              const tenses = TENSES.filter((t) => t.group === value);
              return (
                <section key={value}>
                  <h2 className={`text-xs font-semibold uppercase tracking-widest mb-3 pb-2 border-b ${GROUP_HEADER_COLORS[value]}`}>
                    {label} Tenses
                  </h2>
                  <div className="space-y-2">
                    {tenses.map((tense) => (
                      <TenseCard key={tense.id} tense={tense} />
                    ))}
                  </div>
                </section>
              );
            })}

          </main>
        </div>

        <ProfileRightSidebar />
      </div>
    </div>
  );
};
