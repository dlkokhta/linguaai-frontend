import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, Lock, LogOut, Save, Settings, Shield, ShieldCheck, ShieldOff, User, Wand2 } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";

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
  const { setAccessToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit profile form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Two-Factor Authentication
  const [twoFactorSetupMode, setTwoFactorSetupMode] = useState(false);
  const [twoFactorQrCode, setTwoFactorQrCode] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState<string | null>(null);

  const [openSection, setOpenSection] = useState<"profile" | "password" | "2fa" | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/user/me");
        setProfile(res.data);
        setFirstName(res.data.firstname ?? "");
        setLastName(res.data.lastname ?? "");
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const res = await axiosInstance.patch<UserProfile>("/user/me", {
        firstName,
        lastName,
      });
      setProfile(res.data);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(
        err?.response?.data?.message ?? "Failed to save changes"
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await axiosInstance.patch("/user/me/password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(
        err?.response?.data?.message ?? "Failed to change password"
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleGenerateTwoFactor = async () => {
    setTwoFactorError(null);
    setTwoFactorLoading(true);
    try {
      const res = await axiosInstance.post<{ qrCodeDataURL: string }>("/auth/2fa/generate");
      setTwoFactorQrCode(res.data.qrCodeDataURL);
      setTwoFactorSetupMode(true);
    } catch (err: any) {
      setTwoFactorError(err?.response?.data?.message ?? "Failed to generate QR code");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleEnableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError(null);
    setTwoFactorLoading(true);
    try {
      await axiosInstance.post("/auth/2fa/enable", { code: twoFactorCode });
      setProfile((prev) => prev ? { ...prev, isTwoFactorEnabled: true } : prev);
      setTwoFactorSetupMode(false);
      setTwoFactorQrCode(null);
      setTwoFactorCode("");
      setTwoFactorSuccess("2FA enabled! Your account is now protected.");
      setTimeout(() => setTwoFactorSuccess(null), 4000);
    } catch (err: any) {
      setTwoFactorError(err?.response?.data?.message ?? "Invalid code. Please try again.");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError(null);
    setTwoFactorLoading(true);
    try {
      await axiosInstance.post("/auth/2fa/disable", { code: twoFactorCode });
      setProfile((prev) => prev ? { ...prev, isTwoFactorEnabled: false } : prev);
      setTwoFactorCode("");
      setTwoFactorSetupMode(false);
      setTwoFactorSuccess("2FA has been disabled.");
      setTimeout(() => setTwoFactorSuccess(null), 4000);
    } catch (err: any) {
      setTwoFactorError(err?.response?.data?.message ?? "Invalid code. Please try again.");
    } finally {
      setTwoFactorLoading(false);
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
    <div className="min-h-screen flex dark:bg-gray-900">

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex lg:w-56 flex-col fixed inset-y-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
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
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-1">Account</p>
            {([
              { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
              { id: "settings", label: "Settings",  icon: <Settings size={16} /> },
            ] as const).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-1">Practice</p>
            <button
              onClick={() => navigate(ROUTES.GenerateSentences)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Wand2 size={16} />
              Generate Sentences
            </button>
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-56 min-h-screen bg-gray-50 dark:bg-gray-900">

        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">LinguaAI</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
            <LogOut size={15} />
            Logout
          </button>
        </header>

        {/* Mobile tabs */}
        <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-x-auto">
          {(["overview", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize whitespace-nowrap px-3 transition-colors ${
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
            className="flex-1 py-3 text-sm font-medium whitespace-nowrap px-3 text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors"
          >
            Generate
          </button>
        </div>

        <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="px-5 sm:px-6 pb-5">
                  <div className="-mt-8 mb-3">
                    {profile?.picture ? (
                      <img
                        src={profile.picture}
                        alt="avatar"
                        className="h-16 w-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-gray-800">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {profile?.firstname || profile?.lastname
                      ? `${profile?.firstname ?? ""} ${profile?.lastname ?? ""}`.trim()
                      : "No name set"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${
                        profile?.role === "ADMIN"
                          ? "border-red-400 text-red-600 dark:text-red-400"
                          : "border-gray-300 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {profile?.role}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      · Member since{" "}
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">Learning progress &amp; stats coming soon</p>
              </div>
            </>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === "settings" && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">Account settings</h2>

              {/* Edit Profile */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === "profile" ? null : "profile")}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <User size={15} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Edit Profile</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Update your name</p>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${openSection === "profile" ? "rotate-180" : ""}`} />
                </button>

                {openSection === "profile" && (
                  <form onSubmit={handleSaveProfile} className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500"
                      />
                    </div>
                    {profileError && <p className="text-xs text-red-500">{profileError}</p>}
                    {profileSuccess && <p className="text-xs text-emerald-600">Profile updated!</p>}
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-all"
                    >
                      <Save size={14} />
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                )}
              </div>

              {/* Change Password */}
              {profile?.method === "CREDENTIALS" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === "password" ? null : "password")}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Lock size={15} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Change Password</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Update your password</p>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${openSection === "password" ? "rotate-180" : ""}`} />
                  </button>

                  {openSection === "password" && (
                    <form onSubmit={handleChangePassword} className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password"
                          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500" />
                      </div>
                      {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                      {passwordSuccess && <p className="text-xs text-emerald-600">Password changed!</p>}
                      <button type="submit" disabled={passwordSaving}
                        className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-all">
                        <Shield size={14} />
                        {passwordSaving ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Two-Factor Authentication */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === "2fa" ? null : "2fa")}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Two-Factor Authentication</p>
                      <p className={`text-xs flex items-center gap-1 ${ profile?.isTwoFactorEnabled ? "text-emerald-500" : "text-gray-400 dark:text-gray-500" }`}>
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${ profile?.isTwoFactorEnabled ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-500" }`} />
                        {profile?.isTwoFactorEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${openSection === "2fa" ? "rotate-180" : ""}`} />
                </button>

                {openSection === "2fa" && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                    {twoFactorSuccess && <p className="mb-4 text-xs text-emerald-600 dark:text-emerald-400">{twoFactorSuccess}</p>}

                    {!profile?.isTwoFactorEnabled && (
                      <>
                        {!twoFactorSetupMode ? (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security using an authenticator app (Google Authenticator, Authy, etc.).</p>
                            <button onClick={handleGenerateTwoFactor} disabled={twoFactorLoading}
                              className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-all">
                              {twoFactorLoading ? "Loading..." : "Enable 2FA"}
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleEnableTwoFactor} className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Scan this QR code with your authenticator app, then enter the 6-digit code to confirm.</p>
                            {twoFactorQrCode && (
                              <div className="flex justify-center">
                                <img src={twoFactorQrCode} alt="2FA QR Code" className="w-44 h-44 rounded-xl border border-gray-200 dark:border-gray-600" />
                              </div>
                            )}
                            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={twoFactorCode}
                              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                              placeholder="000000"
                              className="w-full text-center text-2xl tracking-[0.5em] px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-600" />
                            {twoFactorError && <p className="text-xs text-red-500">{twoFactorError}</p>}
                            <div className="flex gap-3">
                              <button type="submit" disabled={twoFactorLoading || twoFactorCode.length !== 6}
                                className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-all">
                                <ShieldCheck size={14} />
                                {twoFactorLoading ? "Verifying..." : "Confirm & Enable"}
                              </button>
                              <button type="button" onClick={() => { setTwoFactorSetupMode(false); setTwoFactorQrCode(null); setTwoFactorCode(""); setTwoFactorError(null); }}
                                className="cursor-pointer px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </>
                    )}

                    {profile?.isTwoFactorEnabled && (
                      <>
                        {!twoFactorSetupMode ? (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Two-factor authentication is active. Your account is protected.</p>
                            <button onClick={() => { setTwoFactorSetupMode(true); setTwoFactorError(null); setTwoFactorCode(""); }}
                              className="cursor-pointer border border-red-300 dark:border-red-700 text-red-500 px-4 py-2 text-sm rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              Disable 2FA
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleDisableTwoFactor} className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Enter the 6-digit code from your authenticator app to disable 2FA.</p>
                            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={twoFactorCode}
                              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                              placeholder="000000" autoFocus
                              className="w-full text-center text-2xl tracking-[0.5em] px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 dark:text-white dark:placeholder:text-gray-600" />
                            {twoFactorError && <p className="text-xs text-red-500">{twoFactorError}</p>}
                            <div className="flex gap-3">
                              <button type="submit" disabled={twoFactorLoading || twoFactorCode.length !== 6}
                                className="cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-colors">
                                <ShieldOff size={14} />
                                {twoFactorLoading ? "Disabling..." : "Confirm Disable"}
                              </button>
                              <button type="button" onClick={() => { setTwoFactorSetupMode(false); setTwoFactorCode(""); setTwoFactorError(null); }}
                                className="cursor-pointer px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};
