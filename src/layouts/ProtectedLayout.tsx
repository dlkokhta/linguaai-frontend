import { Outlet, useNavigate } from "react-router-dom";
import { axiosInstance, useAuth } from "../context/AuthContext";
import { ProfileLeftSidebar } from "../pages/profilePage/components/ProfileLeftSidebar";
import { ProfileRightSidebar } from "../pages/profilePage/components/ProfileRightSidebar";
import { ROUTES } from "../constants";

export const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { setAccessToken, profile } = useAuth();

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
    if (profile?.firstname && profile?.lastname)
      return `${profile.firstname[0]}${profile.lastname[0]}`.toUpperCase();
    if (profile?.firstname) return profile.firstname[0].toUpperCase();
    if (profile?.email) return profile.email[0].toUpperCase();
    return "?";
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col xl:flex-row dark:bg-gray-900">
      <ProfileLeftSidebar
        onLogout={handleLogout}
        profile={profile}
        getInitials={getInitials}
      />
      <div className="flex-1 flex h-full overflow-hidden">
        <Outlet />
        <ProfileRightSidebar />
      </div>
    </div>
  );
};
