import {
  Sparkles, Volume2, Languages, BookOpen,
  MessageSquare, PenLine, Headphones,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const FEATURES = [
  { icon: Sparkles, title: "AI Sentence Generator", description: "Ask for 10 sentences on any topic — About Myself, Travel, Work — and get them instantly.", badge: "AI Powered" },
  { icon: BookOpen, title: "Vocabulary Builder", description: "Paste new words and LinguaAI crafts natural sentences to help you memorise them in context.", badge: "Smart Learning" },
  { icon: Volume2, title: "Text-to-Speech", description: "Hear every sentence read aloud in natural English. Perfect your listening and pronunciation.", badge: "Audio" },
  { icon: Languages, title: "Georgian Translation", description: "Instantly translate any sentence or paragraph into Georgian so nothing gets lost.", badge: "Translation" },
  { icon: Headphones, title: "Reading Practice", description: "Paste any text and listen to it read in fluent English — then compare with the Georgian version.", badge: "Practice" },
  { icon: MessageSquare, title: "Conversational Topics", description: "Explore real-world themes: job interviews, travel, small talk, and more.", badge: "Topics" },
  { icon: PenLine, title: "Writing Practice", description: "Write your own sentences and get AI feedback to improve grammar and fluency.", badge: "Coming Soon" },
  { icon: MessageSquare, title: "Progress Tracking", description: "See exactly how many words you have learned and sentences you have practised over time.", badge: "Coming Soon" },
];

export const FeaturesGrid = () => (
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
);
