import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

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

export const HowItWorks = () => (
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
);
