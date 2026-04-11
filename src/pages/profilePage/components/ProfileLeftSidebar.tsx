import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Settings, Wand2 } from "lucide-react";
import { ROUTES } from "../../../constants";

interface UserProfile {
  firstname: string | null;
  lastname: string | null;
  email: string;
  role: "REGULAR" | "ADMIN";
  picture: string | null;
}

interface Props {
  activeTab: "overview" | "settings";
  onTabChange: (tab: "overview" | "settings") => void;
  onLogout: () => void;
  profile: UserProfile;
  getInitials: () => string;
}

export const ProfileLeftSidebar = ({ activeTab, onTabChange, onLogout, profile, getInitials }: Props) => {
  const navigate = useNavigate();

  const fullName = profile.firstname || profile.lastname
    ? `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim()
    : "No name set";

  return (
    <>
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex lg:w-56 flex-col sticky top-0 h-screen shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">LinguaAI</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 mb-1">Account</p>
            {([
              { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
              { id: "settings", label: "Settings", icon: <Settings size={16} /> },
            ] as const).map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 mb-1">Practice</p>
            <button
              onClick={() => navigate(ROUTES.GenerateSentences)}
              className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Wand2 size={16} />
              Generate Sentences
            </button>
          </div>
        </nav>

        {/* ── User info + Logout ── */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 text-xs font-bold text-white overflow-hidden">
              {profile.picture
                ? <img src={profile.picture} alt="avatar" className="w-full h-full object-cover rounded-full" />
                : getInitials()
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{fullName}</p>
              <p className="text-xs text-gray-400 truncate">{profile.email}</p>
            </div>
          </div>
          <div className="px-3 pb-3">
            <button
              onClick={onLogout}
              className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">LinguaAI</span>
        </div>
        <button onClick={onLogout} className="cursor-pointer flex items-center gap-1.5 text-sm text-red-500 font-medium">
          <LogOut size={15} />
          Logout
        </button>
      </header>

      {/* ── Mobile tabs ── */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-x-auto">
        {(["overview", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`cursor-pointer flex-1 py-3 text-sm font-medium capitalize whitespace-nowrap px-3 transition-colors ${
              activeTab === tab
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={() => navigate(ROUTES.GenerateSentences)}
          className="cursor-pointer flex-1 py-3 text-sm font-medium whitespace-nowrap px-3 text-gray-500 dark:text-gray-400 transition-colors"
        >
          Generate
        </button>
      </div>
    </>
  );
};
