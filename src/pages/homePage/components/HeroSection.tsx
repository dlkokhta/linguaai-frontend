import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 60, damping: 20 });

  return (
    <section ref={heroRef} className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">

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
          <span className="text-emerald-500 dark:text-emerald-400">smart way.</span>
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
  );
};
