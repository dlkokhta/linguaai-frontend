import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Layers, BookMarked, Sparkles, Trophy, CalendarClock } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";

export interface FlashcardStats {
  due: number;
  new: number;
  learned: number;
  total: number;
}

export const FlashcardsPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const { data: stats, isPending } = useQuery({
    queryKey: ["flashcard-stats"],
    queryFn: () =>
      axiosInstance.get<FlashcardStats>("/flashcards/stats").then((r) => r.data),
    enabled: !!accessToken,
  });

  const tiles = [
    { label: "Due today", value: stats?.due ?? 0, icon: <CalendarClock size={18} className="text-emerald-500" /> },
    { label: "New", value: stats?.new ?? 0, icon: <Sparkles size={18} className="text-sky-500" /> },
    { label: "Learned", value: stats?.learned ?? 0, icon: <Trophy size={18} className="text-amber-500" /> },
    { label: "Total cards", value: stats?.total ?? 0, icon: <BookMarked size={18} className="text-gray-400" /> },
  ];

  return (
    <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={18} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Flashcards</h1>
        </div>

        {isPending && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {!isPending && stats && stats.total === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center py-8">
              <Layers size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your deck is empty — every word and sentence you save becomes a flashcard.
              </p>
              <button
                onClick={() => navigate(ROUTES.TranslateWord)}
                className="cursor-pointer mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                Go to Translate Word
              </button>
            </div>
          </div>
        )}

        {!isPending && stats && stats.total > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {tiles.map((tile) => (
                <div
                  key={tile.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  {tile.icon}
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{tile.value}</p>
                    <p className="text-xs text-gray-400">{tile.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl opacity-50 cursor-not-allowed"
            >
              Start review — coming soon
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
