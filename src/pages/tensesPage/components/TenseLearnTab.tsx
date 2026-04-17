import { Volume2 } from "lucide-react";
import type { Tense } from "../../../data/tenses";

interface Props {
  tense: Tense;
}

const speakText = (text: string) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

export const TenseLearnTab = ({ tense }: Props) => {
  return (
    <div className="space-y-4">

      {/* Formula */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Formula
        </p>
        <p className="text-base font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          {tense.formula}
        </p>
      </div>

      {/* When to use */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          When to use
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {tense.whenToUse}
        </p>
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            ქართული განმარტება
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {tense.georgianExplanation}
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Examples
        </p>
        <div className="space-y-3">
          {tense.examples.map((example, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{example.en}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{example.ka}</p>
              </div>
              <button
                type="button"
                onClick={() => speakText(example.en)}
                className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shrink-0"
                title="Listen"
              >
                <Volume2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
