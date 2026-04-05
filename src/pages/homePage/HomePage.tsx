import { useNavigate } from "react-router-dom";
import {
  LogIn, UserPlus, Sparkles, Volume2, Languages, BookOpen,
  MessageSquare, PenLine, Headphones, ArrowRight, CheckCircle2,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Sentence Generator",
    description: "Ask for 10 sentences on any topic — About Myself, Travel, Work — and get them instantly.",
    badge: "AI Powered",
  },
  {
    icon: BookOpen,
    title: "Vocabulary Builder",
    description: "Paste new words and LinguaAI crafts natural sentences to help you memorise them in context.",
    badge: "Smart Learning",
  },
  {
    icon: Volume2,
    title: "Text-to-Speech",
    description: "Hear every sentence read aloud in natural English. Perfect your listening and pronunciation.",
    badge: "Audio",
  },
  {
    icon: Languages,
    title: "Georgian Translation",
    description: "Instantly translate any sentence or paragraph into Georgian so nothing gets lost.",
    badge: "Translation",
  },
  {
    icon: Headphones,
    title: "Reading Practice",
    description: "Paste any text and listen to it read in fluent English — then compare with the Georgian version.",
    badge: "Practice",
  },
  {
    icon: MessageSquare,
    title: "Conversational Topics",
    description: "Explore real-world themes: job interviews, travel, small talk, and more.",
    badge: "Topics",
  },
  {
    icon: PenLine,
    title: "Writing Practice",
    description: "Write your own sentences and get AI feedback to improve grammar and fluency.",
    badge: "Coming Soon",
  },
  {
    icon: MessageSquare,
    title: "Progress Tracking",
    description: "See exactly how many words you have learned and sentences you have practised over time.",
    badge: "Coming Soon",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Choose a topic",
    description: "Pick a real-life subject or paste vocabulary you want to practise.",
  },
  {
    number: "02",
    title: "Get AI content",
    description: "LinguaAI generates natural sentences, explanations and translations instantly.",
  },
  {
    number: "03",
    title: "Listen & learn",
    description: "Hear the text read aloud in English, then check the Georgian translation.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export const Homepage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 60, damping: 20 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 overflow-hidden">

      {/* ── Nav ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-10"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">L</span>
          </div>
          <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight">LinguaAI</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors"
          >
            Sign in
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            className="cursor-pointer text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-lg shadow-sm transition-all"
          >
            Get started
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">

        {/* Emerald glow ring — unique accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emerald-200/40 dark:border-emerald-800/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-emerald-300/30 dark:border-emerald-700/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-2xl pointer-events-none" />

        <motion.div style={{ y: springY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center max-w-4xl">

          <motion.span
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase shadow-sm"
          >
            <Sparkles size={12} />
            AI-Powered English Learning
          </motion.span>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
          >
            Master English the{" "}
            <span className="text-emerald-500 dark:text-emerald-400">
              smart way.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mb-4 leading-relaxed"
          >
            Generate sentences on any topic, build your vocabulary, hear natural English pronunciation,
            and get instant Georgian translations — all powered by AI.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2.5}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-sm text-gray-500 dark:text-gray-400"
          >
            {["AI sentence generation", "Georgian translation", "Text-to-speech", "Vocabulary builder"].map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" /> {f}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs sm:max-w-none"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 14px 36px rgba(16,185,129,0.40)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3.5 rounded-xl shadow-lg font-semibold text-sm sm:text-base"
            >
              <UserPlus size={18} />
              Start learning free
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="cursor-pointer flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-8 py-3.5 rounded-xl shadow-sm font-semibold text-sm sm:text-base hover:border-emerald-300 transition-colors"
            >
              <LogIn size={18} />
              Sign in
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3"
        >
          How it works
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="text-center text-gray-500 dark:text-gray-400 mb-12 text-sm sm:text-base"
        >
          Three simple steps to accelerate your English fluency.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map(({ number, title, description }, i) => (
            <motion.div
              key={number}
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-40px" }} custom={i}
              className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white dark:border-gray-700 rounded-2xl p-6 shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-white font-bold text-sm">{number}</span>
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3"
        >
          Everything you need to learn English
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="text-center text-gray-500 dark:text-gray-400 mb-12 text-sm sm:text-base max-w-xl mx-auto"
        >
          One platform combining AI generation, audio, translation and practice tools.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map(({ icon: Icon, title, description, badge }, i) => (
            <motion.div
              key={title}
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }} custom={i}
              whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(16,185,129,0.12)" }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white dark:border-gray-700 rounded-2xl p-5 shadow-sm cursor-default group"
            >
              <div className="flex items-start justify-between mb-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                  className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Icon size={20} className="text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-24">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-10 sm:p-14 text-center overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-extrabold text-white mb-3"
          >
            Ready to speak English with confidence?
          </motion.h2>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-emerald-100 mb-8 text-sm sm:text-base max-w-lg mx-auto"
          >
            Join LinguaAI today — it is free to get started and takes less than a minute to sign up.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            className="cursor-pointer inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-8 py-3.5 rounded-xl shadow-lg text-sm sm:text-base transition-all"
          >
            <UserPlus size={18} />
            Create free account
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-gray-200 dark:border-gray-700/60 py-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">L</span>
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">LinguaAI</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} LinguaAI. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};
