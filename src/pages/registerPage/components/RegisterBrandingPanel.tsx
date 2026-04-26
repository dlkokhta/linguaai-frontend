import { Sparkles, Target, Zap, Globe } from "lucide-react";

const FEATURES = [
  { icon: <Sparkles size={18} />, text: "AI-powered sentence generation" },
  { icon: <Target size={18} />, text: "Personalised vocabulary builder" },
  { icon: <Zap size={18} />, text: "Instant feedback & progress tracking" },
  { icon: <Globe size={18} />, text: "Georgian ↔ English translations" },
];

export const RegisterBrandingPanel = () => (
  <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-emerald-500 to-teal-600 flex-col justify-between p-12 relative overflow-hidden">
    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
    <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full border border-white/10" />
    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-white/10" />
    <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full border border-white/10" />

    <div className="flex items-center gap-3 relative z-10">
      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-lg">L</span>
      </div>
      <span className="text-white font-semibold text-xl">LinguaAI</span>
    </div>

    <div className="relative z-10">
      <h2 className="text-white text-3xl font-bold leading-snug mb-10">
        Start your English<br />learning journey today.
      </h2>
      <ul className="space-y-5">
        {FEATURES.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>

    <p className="text-white/50 text-xs relative z-10">© 2026 LinguaAI. All rights reserved.</p>
  </div>
);
