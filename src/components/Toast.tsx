import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const show = setTimeout(() => setVisible(true), 10);
    // Start exit animation after 2.5s
    const hide = setTimeout(() => setVisible(false), 2500);
    // Remove from DOM after animation completes
    const remove = setTimeout(() => onClose(), 3000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, []);

  return (
    <div
      className={`fixed top-20 left-6 xl:left-80 z-50 flex items-center gap-2.5 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
      {message}
    </div>
  );
};
