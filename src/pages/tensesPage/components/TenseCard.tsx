import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Tense } from "../../../data/tenses";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "../../../data/tenses";

interface Props {
  tense: Tense;
}

export const TenseCard = ({ tense }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/tenses/${tense.id}`)}
      className="cursor-pointer w-full text-left bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {tense.name}
            </h3>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLORS[tense.difficulty]}`}>
              {DIFFICULTY_LABELS[tense.difficulty]}
            </span>
          </div>
          <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-1.5">
            {tense.formula}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {tense.whenToUse}
          </p>
        </div>
        <ChevronRight
          size={16}
          className="text-gray-400 dark:text-gray-600 group-hover:text-emerald-500 transition-colors shrink-0 mt-0.5"
        />
      </div>
    </button>
  );
};
