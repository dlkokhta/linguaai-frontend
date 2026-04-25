import { GraduationCap } from "lucide-react";
import type { TenseGroup } from "../../data/tenses";
import { TENSES, TENSE_GROUPS } from "../../data/tenses";
import { TenseCard } from "./components/TenseCard";

const GROUP_HEADER_COLORS: Record<TenseGroup, string> = {
  present: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  past:    "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  future:  "text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
};

export const TensesOverviewPage = () => {
  return (
    <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">

        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">English Tenses</h1>
        </div>

        {TENSE_GROUPS.map(({ label, value }) => {
          const tenses = TENSES.filter((t) => t.group === value);
          return (
            <section key={value}>
              <h2 className={`text-xs font-semibold uppercase tracking-widest mb-3 pb-2 border-b ${GROUP_HEADER_COLORS[value]}`}>
                {label} Tenses
              </h2>
              <div className="space-y-2">
                {tenses.map((tense) => (
                  <TenseCard key={tense.id} tense={tense} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};
