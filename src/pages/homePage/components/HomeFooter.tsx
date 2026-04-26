import { motion } from "framer-motion";

export const HomeFooter = () => (
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
);
