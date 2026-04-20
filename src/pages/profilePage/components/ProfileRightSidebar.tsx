import { PomodoroTimer } from "../../../components/PomodoroTimer";

export const ProfileRightSidebar = () => {
  return (
    <aside className="hidden xl:flex xl:w-72 xl:mr-20 flex-col sticky top-0 h-screen border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
      <div className="flex flex-col gap-3 p-3">

        {/* Focus Timer (replaces Word of the Day) */}
        <PomodoroTimer />

        {/* Word of the Day — kept for later, temporarily replaced by Focus Timer
        <div className="rounded-2xl bg-[#0a2218] p-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300 mb-2">Word of the Day</p>
          <h3 className="text-2xl font-serif font-bold mb-0.5">Eloquent</h3>
          <p className="text-sm italic text-emerald-300 mb-2">adjective</p>
          <p className="text-xs leading-relaxed text-emerald-100 mb-3">
            Fluent and persuasive in speaking or writing; clearly expressing ideas.
          </p>
          <blockquote className="border-l-2 border-emerald-400 pl-3 text-xs italic text-emerald-200">
            "She gave an eloquent speech that moved the entire audience."
          </blockquote>
        </div>
        */}

        {/* This Week */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500 mb-3">This Week</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">48</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Sentences</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">23</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">New Words</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                <span>Weekly Goal</span><span>60%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                <span>Practice Sessions</span><span>80%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Practice */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-emerald-50 dark:bg-gray-800 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500 mb-3">Quick Practice</p>
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
            I am a <span className="inline-block w-16 border-b-2 border-gray-400 align-bottom" /> developer based in Georgia.
          </p>
          <input
            type="text"
            placeholder="Fill in the blank..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-3"
          />
          <button className="cursor-pointer w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors">
            Check Answer
          </button>
        </div>

      </div>
    </aside>
  );
};
