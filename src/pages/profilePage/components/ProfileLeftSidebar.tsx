import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bookmark, BookMarked, BrainCircuit, FileText, Languages,
  LayoutDashboard, LogOut, Menu, Settings, Wand2, X,
} from "lucide-react";
import { ROUTES } from "../../../constants";

interface UserProfile {
  firstname: string | null;
  lastname: string | null;
  email: string;
  role: "REGULAR" | "ADMIN";
  picture: string | null;
}

interface Props {
  activeTab?: "overview" | "settings";
  onTabChange?: (tab: "overview" | "settings") => void;
  onLogout: () => void;
  profile: UserProfile;
  getInitials: () => string;
}

export const ProfileLeftSidebar = ({ activeTab, onTabChange, onLogout, profile, getInitials }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const fullName =
    profile.firstname || profile.lastname
      ? `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim()
      : "No name set";

  const accountItems = [
    { id: "overview" as const, label: "Overview", icon: <LayoutDashboard size={16} /> },
    { id: "settings" as const, label: "Settings", icon: <Settings size={16} /> },
  ];

  const practiceItems = [
    { route: ROUTES.GenerateSentences, label: "Generate Sentences", icon: <Wand2 size={16} /> },
    { route: ROUTES.SavedSentences,    label: "Saved Sentences",    icon: <Bookmark size={16} /> },
    { route: ROUTES.TranslateWord,     label: "Translate Word",     icon: <Languages size={16} /> },
    { route: ROUTES.TranslateText,     label: "Translate Text",     icon: <FileText size={16} /> },
    { route: ROUTES.SavedWords,        label: "Saved Words",        icon: <BookMarked size={16} /> },
    { route: ROUTES.VocabularyQuiz,    label: "Vocabulary Quiz",    icon: <BrainCircuit size={16} /> },
  ];

  const pageTitle = (() => {
    const practice = practiceItems.find((i) => i.route === pathname);
    if (practice) return practice.label;
    if (pathname === ROUTES.Profile) return activeTab === "settings" ? "Settings" : "Overview";
    return "";
  })();

  const navItemClass = (active: boolean) =>
    `cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  const DrawerContent = () => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 mb-1">Account</p>
          {accountItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange ? onTabChange(item.id) : navigate(ROUTES.Profile, { state: { tab: item.id } });
                setOpen(false);
              }}
              className={navItemClass(activeTab === item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 mb-1">Practice</p>
          {practiceItems.map((item) => (
            <button
              key={item.route}
              onClick={() => { navigate(item.route); setOpen(false); }}
              className={navItemClass(pathname === item.route)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

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
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
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
            {accountItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange ? onTabChange(item.id) : navigate(ROUTES.Profile, { state: { tab: item.id } })}
                className={navItemClass(activeTab === item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 mb-1">Practice</p>
            {practiceItems.map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={navItemClass(pathname === item.route)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

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

      {/* ── Mobile navbar ── */}
      <div className="lg:hidden sticky top-0 z-40">
        {/* Top bar — matches homepage navbar style */}
        <nav className="flex items-center justify-between px-5 py-3.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60">
          {/* Left: logo */}
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-bold text-gray-800 dark:text-white tracking-tight">LinguaAI</span>
          </div>

          {/* Right: burger */}
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer p-2 -mr-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>

        {/* Page title strip */}
        {pageTitle && (
          <div className="px-5 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{pageTitle}</p>
          </div>
        )}
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${open ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel */}
        <div className={`absolute right-0 top-0 h-full w-72 flex flex-col bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-end px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <DrawerContent />
        </div>
      </div>
    </>
  );
};
