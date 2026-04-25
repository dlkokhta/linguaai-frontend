import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../context/AuthContext";
import { ProfileLeftSidebar } from "./components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "./components/ProfileRightSidebar";
import { EditProfileSection } from "./components/EditProfileSection";
import { UpdatePasswordSection } from "./components/UpdatePasswordSection";
import { TwoFactorSection } from "./components/TwoFactorSection";
import { OverviewSection } from "./components/OverviewSection";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, profile, setProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "settings">(
    location.state?.tab ?? "overview"
  );

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
    <div className="min-h-screen flex flex-col xl:flex-row dark:bg-gray-900">

      <ProfileLeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        profile={profile}
        getInitials={getInitials}
      />

      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

            {activeTab === "overview" && profile && (
              <OverviewSection
                createdAt={profile.createdAt}
                method={profile.method}
                isTwoFactorEnabled={profile.isTwoFactorEnabled}
              />
            )}

            {activeTab === "settings" && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">Account settings</h2>

                <EditProfileSection
                  initialFirstName={profile?.firstname ?? ""}
                  initialLastName={profile?.lastname ?? ""}
                  onProfileUpdate={(updated: UserProfile) => setProfile(updated)}
                />

                {profile?.method === "CREDENTIALS" && (
                  <UpdatePasswordSection />
                )}

                <TwoFactorSection
                  isTwoFactorEnabled={profile?.isTwoFactorEnabled ?? false}
                  onToggle={(enabled) => {
                    if (profile) setProfile({ ...profile, isTwoFactorEnabled: enabled });
                  }}
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
