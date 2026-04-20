import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ProfileLeftSidebar } from "./components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "./components/ProfileRightSidebar";
import { EditProfileSection } from "./components/EditProfileSection";
import { UpdatePasswordSection } from "./components/UpdatePasswordSection";
import { TwoFactorSection } from "./components/TwoFactorSection";

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

export const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">(
    location.state?.tab ?? "overview"
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/user/me");
        setProfile(res.data);
      } catch {
        navigate("/login");
      } finally {
        setLoadingProfile(false);
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

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row dark:bg-gray-900">

      <ProfileLeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        profile={profile!}
        getInitials={getInitials}
      />

      {/* ── Main + Right ── */}
      <div className="flex-1 flex min-h-screen">

        {/* Main */}
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">Learning progress &amp; stats coming soon</p>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === "settings" && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">Account settings</h2>

                <EditProfileSection
                  initialFirstName={profile?.firstname ?? ""}
                  initialLastName={profile?.lastname ?? ""}
                  onProfileUpdate={setProfile}
                />

                {profile?.method === "CREDENTIALS" && (
                  <UpdatePasswordSection />
                )}

                <TwoFactorSection
                  isTwoFactorEnabled={profile?.isTwoFactorEnabled ?? false}
                  onToggle={(enabled) => setProfile((prev) => prev ? { ...prev, isTwoFactorEnabled: enabled } : prev)}
                />
              </div>
            )}

          </main>
        </div>

        <ProfileRightSidebar />

      </div>
    </div>
  );
};
