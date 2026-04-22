import { useEffect, useState } from "react";
import { Bookmark, BookMarked, Calendar, KeyRound, Shield, ShieldCheck } from "lucide-react";
import { axiosInstance } from "../../../context/AuthContext";

interface Props {
  createdAt: string;
  method: string;
  isTwoFactorEnabled: boolean;
}

export const OverviewSection = ({ createdAt, method, isTwoFactorEnabled }: Props) => {
  const [sentenceCount, setSentenceCount] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      axiosInstance.get<{ id: string }[]>("/saved-sentences"),
      axiosInstance.get<{ id: string }[]>("/saved-words"),
    ]).then(([sentences, words]) => {
      setSentenceCount(sentences.data.length);
      setWordCount(words.data.length);
    }).catch(() => {
      setSentenceCount(0);
      setWordCount(0);
    });
  }, []);

  const memberSince = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Saved Sentences",
      value: sentenceCount ?? "—",
      icon: <Bookmark size={18} className="text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Saved Words",
      value: wordCount ?? "—",
      icon: <BookMarked size={18} className="text-teal-600 dark:text-teal-400" />,
      bg: "bg-teal-50 dark:bg-teal-900/20",
    },
  ];

  const info = [
    {
      label: "Member Since",
      value: memberSince,
      icon: <Calendar size={16} className="text-gray-400" />,
    },
    {
      label: "Auth Method",
      value: method === "GOOGLE" ? "Google" : "Email & Password",
      icon: <KeyRound size={16} className="text-gray-400" />,
    },
    {
      label: "Two-Factor Auth",
      value: isTwoFactorEnabled ? "Enabled" : "Disabled",
      icon: isTwoFactorEnabled
        ? <ShieldCheck size={16} className="text-emerald-500" />
        : <Shield size={16} className="text-gray-400" />,
      valueClass: isTwoFactorEnabled
        ? "text-emerald-600 dark:text-emerald-400 font-medium"
        : "text-gray-500 dark:text-gray-400",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3"
          >
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info rows */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        {info.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2.5">
              {item.icon}
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
            </div>
            <p className={`text-sm ${item.valueClass ?? "text-gray-900 dark:text-white"}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
