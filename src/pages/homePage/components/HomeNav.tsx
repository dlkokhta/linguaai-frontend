import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const HomeNav = () => {
  const navigate = useNavigate();

  return (
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
  );
};
