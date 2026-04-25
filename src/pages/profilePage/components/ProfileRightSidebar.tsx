import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { PomodoroTimer } from "../../../components/PomodoroTimer";
import { TranslateWordWidget } from "../../../components/TranslateWordWidget";
import { axiosInstance } from "../../../context/AuthContext";

interface WeeklyProgress {
  sentenceGoal: number | null;
  wordGoal: number | null;
  sentencesThisWeek: number;
  wordsThisWeek: number;
}

export const ProfileRightSidebar = () => {
  const queryClient = useQueryClient();
  const [setting, setSetting] = useState(false);
  const [sentenceInput, setSentenceInput] = useState("");
  const [wordInput, setWordInput] = useState("");

  const { data: progress } = useQuery({
    queryKey: ["weekly-goal"],
    queryFn: () => axiosInstance.get<WeeklyProgress>("/weekly-goal").then((r) => r.data),
  });

  const saveMutation = useMutation({
    mutationFn: (goal: { sentenceGoal: number; wordGoal: number }) =>
      axiosInstance.post("/weekly-goal", goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-goal"] });
      setSetting(false);
      setSentenceInput("");
      setWordInput("");
    },
  });

  const handleSave = () => {
    const sentenceGoal = parseInt(sentenceInput);
    const wordGoal = parseInt(wordInput);
    if (!sentenceGoal || !wordGoal || sentenceGoal < 1 || wordGoal < 1) return;
    saveMutation.mutate({ sentenceGoal, wordGoal });
  };

  const sentencePct = progress?.sentenceGoal
    ? Math.min(100, Math.round((progress.sentencesThisWeek / progress.sentenceGoal) * 100))
    : 0;

  const wordPct = progress?.wordGoal
    ? Math.min(100, Math.round((progress.wordsThisWeek / progress.wordGoal) * 100))
    : 0;

  const goalIsSet = progress?.sentenceGoal !== null && progress?.sentenceGoal !== undefined;

  return (
    <aside className="hidden xl:flex xl:w-72 xl:mr-20 flex-col sticky top-0 h-screen border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
      <div className="flex flex-col gap-3 p-3">

        <PomodoroTimer />

        {/* Weekly Goal widget */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            {goalIsSet ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">Weekly Goal</p>
                <button
                  onClick={() => {
                    setSentenceInput(String(progress?.sentenceGoal ?? ""));
                    setWordInput(String(progress?.wordGoal ?? ""));
                    setSetting(true);
                  }}
                  className="cursor-pointer p-1 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Edit goal"
                >
                  <Pencil size={12} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSetting(true)}
                className="cursor-pointer text-[10px] font-semibold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Set Weekly Goal
              </button>
            )}
          </div>

          {/* Set goal form */}
          {setting && (
            <div className="mb-3 space-y-2">
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Sentence goal</p>
                <input
                  type="number"
                  min={1}
                  value={sentenceInput}
                  onChange={(e) => setSentenceInput(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Word goal</p>
                <input
                  type="number"
                  min={1}
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="cursor-pointer flex-1 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  onClick={() => { setSetting(false); setSentenceInput(""); setWordInput(""); }}
                  className="cursor-pointer flex-1 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">{progress?.sentencesThisWeek ?? 0}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Sentences</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">{progress?.wordsThisWeek ?? 0}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">New Words</p>
            </div>
          </div>

          {/* Progress bars */}
          {goalIsSet && (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                  <span>Sentences</span><span>{sentencePct}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${sentencePct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                  <span>Words</span><span>{wordPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${wordPct}%` }} />
                </div>
              </div>
            </div>
          )}

        </div>

        <TranslateWordWidget />

      </div>
    </aside>
  );
};
