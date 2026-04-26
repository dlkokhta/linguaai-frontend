import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export const CTABanner = () => {
  const navigate = useNavigate();

  return (
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
  );
};
