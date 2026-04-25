import { useState } from "react";
import { ChevronDown, ShieldCheck, ShieldOff } from "lucide-react";
import { axiosInstance } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../types/errors";

interface Props {
  isTwoFactorEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const TwoFactorSection = ({ isTwoFactorEnabled, onToggle }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axiosInstance.post<{ qrCodeDataURL: string }>("/auth/2fa/generate");
      setQrCode(res.data.qrCodeDataURL);
      setSetupMode(true);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to generate QR code"));
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axiosInstance.post("/auth/2fa/enable", { code });
      onToggle(true);
      setSetupMode(false);
      setQrCode(null);
      setCode("");
      setSuccess("2FA enabled! Your account is now protected.");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(getErrorMessage(err, "Invalid code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axiosInstance.post("/auth/2fa/disable", { code });
      onToggle(false);
      setCode("");
      setSetupMode(false);
      setSuccess("2FA has been disabled.");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(getErrorMessage(err, "Invalid code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Two-Factor Authentication</p>
            <p className={`text-xs flex items-center gap-1 ${isTwoFactorEnabled ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"}`}>
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isTwoFactorEnabled ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-500"}`} />
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
          {success && <p className="mb-4 text-xs text-emerald-600 dark:text-emerald-400">{success}</p>}

          {!isTwoFactorEnabled && (
            <>
              {!setupMode ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security using an authenticator app (Google Authenticator, Authy, etc.).</p>
                  <button onClick={handleGenerate} disabled={loading}
                    className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-all">
                    {loading ? "Loading..." : "Enable 2FA"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnable} className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Scan this QR code with your authenticator app, then enter the 6-digit code to confirm.</p>
                  {qrCode && (
                    <div className="flex justify-center">
                      <img src={qrCode} alt="2FA QR Code" className="w-44 h-44 rounded-xl border border-gray-200 dark:border-gray-600" />
                    </div>
                  )}
                  <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full text-center text-2xl tracking-[0.5em] px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-600" />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading || code.length !== 6}
                      className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-all">
                      <ShieldCheck size={14} />
                      {loading ? "Verifying..." : "Confirm & Enable"}
                    </button>
                    <button type="button" onClick={() => { setSetupMode(false); setQrCode(null); setCode(""); setError(null); }}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {isTwoFactorEnabled && (
            <>
              {!setupMode ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Two-factor authentication is active. Your account is protected.</p>
                  <button onClick={() => { setSetupMode(true); setError(null); setCode(""); }}
                    className="cursor-pointer border border-red-300 dark:border-red-700 text-red-500 px-4 py-2 text-sm rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Disable 2FA
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDisable} className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enter the 6-digit code from your authenticator app to disable 2FA.</p>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000" autoFocus
                    className="w-full text-center text-2xl tracking-[0.5em] px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 dark:text-white dark:placeholder:text-gray-600" />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading || code.length !== 6}
                      className="cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded-xl font-medium disabled:opacity-60 transition-colors">
                      <ShieldOff size={14} />
                      {loading ? "Disabling..." : "Confirm Disable"}
                    </button>
                    <button type="button" onClick={() => { setSetupMode(false); setCode(""); setError(null); }}
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
  );
};
