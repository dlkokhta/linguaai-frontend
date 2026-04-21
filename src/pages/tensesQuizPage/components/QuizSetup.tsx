import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { TENSES, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "../../../data/tenses";
import type { TenseDifficulty } from "../../../data/tenses";

export type QuizLevel = "basic" | "intermediate" | "advanced";

interface Props {
  onStart: (tenseName: string, formula: string, whenToUse: string, level: QuizLevel) => Promise<void>;
  loading: boolean;
}

export const QuizSetup = ({ onStart, loading }: Props) => {
  const [selectedTenseId, setSelectedTenseId] = useState(TENSES[0].id);
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel>("basic");

  const handleStart = () => {
    const tense = TENSES.find((t) => t.id === selectedTenseId)!;
    onStart(tense.name, tense.formula, tense.whenToUse, selectedLevel);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Set Up Your Quiz</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose a tense and difficulty level to generate 10 quiz questions.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tense</label>
        <select
          value={selectedTenseId}
          onChange={(e) => setSelectedTenseId(e.target.value)}
          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
        >
          {TENSES.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Level</label>
        <div className="flex gap-2">
          {(["basic", "intermediate", "advanced"] as QuizLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(level)}
              className={`cursor-pointer flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                selectedLevel === level
                  ? `${DIFFICULTY_COLORS[level as TenseDifficulty]} border-current`
                  : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-300"
              }`}
            >
              {DIFFICULTY_LABELS[level as TenseDifficulty]}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 text-sm rounded-xl font-medium disabled:opacity-60 transition-all"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
        {loading ? "Generating quiz…" : "Start Quiz"}
      </button>
    </div>
  );
};
