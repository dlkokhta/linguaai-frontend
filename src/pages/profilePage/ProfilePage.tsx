import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../context/AuthContext";
import { EditProfileSection } from "./components/EditProfileSection";
import { UpdatePasswordSection } from "./components/UpdatePasswordSection";
import { TwoFactorSection } from "./components/TwoFactorSection";
import { OverviewSection } from "./components/OverviewSection";

export const ProfilePage = () => {
  const location = useLocation();
  const { profile, setProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "settings">(
    location.state?.tab ?? "overview"
  );

  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab);
  }, [location.state?.tab]);

  return (
    <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
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
  );
};
