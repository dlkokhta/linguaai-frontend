import { useState } from "react";
import { TENSES } from "../../../data/tenses";

type Mode = "word-bank" | "typing";

interface Props {
  onStart: (tenses: string[], topic: string, mode: Mode) => void;
  loading: boolean;
}

const GROUPS = [
  { label: "Present", id: "present" as const },
  { label: "Past", id: "past" as const },
  { label: "Future", id: "future" as const },
];

export const TensePracticeSetup = ({ onStart, loading }: Props) => {
  const [selectedTenses, setSelectedTenses] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<Mode>("word-bank");

  const toggleTense = (name: string) => {
    if (selectedTenses.includes(name)) {
      setSelectedTenses(selectedTenses.filter((t) => t !== name));
    } else if (selectedTenses.length < 5) {
      setSelectedTenses([...selectedTenses, name]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Mode selection */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Practice Mode</p>
        <div className="flex gap-3">
          {(
            [
              { value: "word-bank" as const, label: "Word Bank", desc: "Choose words to build the sentence" },
              { value: "typing" as const, label: "Typing", desc: "Type the English translation" },
            ]
          ).map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`flex-1 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                mode === value
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <p className={`text-sm font-medium ${mode === value ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                {label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tense selection */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Tenses</p>
          <span className="text-xs text-gray-400">{selectedTenses.length}/5 selected</span>
        </div>
        {GROUPS.map(({ label, id }) => (
          <div key={id} className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {TENSES.filter((t) => t.group === id).map((tense) => {
                const selected = selectedTenses.includes(tense.name);
                const disabled = !selected && selectedTenses.length >= 5;
                return (
                  <button
                    key={tense.id}
                    type="button"
                    onClick={() => toggleTense(tense.name)}
                    disabled={disabled}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                        : disabled
                        ? "border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {tense.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Topic */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-2">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Topic <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. work, travel, food..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
        />
      </div>

      <button
        type="button"
        onClick={() => onStart(selectedTenses, topic, mode)}
        disabled={selectedTenses.length === 0 || loading}
        className="cursor-pointer w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all"
      >
        {loading ? "Generating..." : "Start Practice"}
      </button>
    </div>
  );
};
