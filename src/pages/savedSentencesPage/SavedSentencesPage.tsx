import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance, useAuth } from "../../context/AuthContext";
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

export const SavedSentencesPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/user/me");
        setProfile(res.data);
      } catch {
        navigate("/login");
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
      navigate("/login");
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
    <div className="min-h-screen flex dark:bg-gray-900">

      <ProfileLeftSidebar
        onLogout={handleLogout}
        profile={profile ?? { firstname: null, lastname: null, email: "", role: "REGULAR", picture: null }}
        getInitials={getInitials}
      />

      <div className="flex-1 lg:ml-56 flex min-h-screen">

        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">

            <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Sentences</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">Saved sentences coming soon</p>
            </div>

          </main>
        </div>

        <ProfileRightSidebar />

      </div>
    </div>
  );
};
