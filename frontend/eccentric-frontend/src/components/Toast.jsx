import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../store/useToast";

export default function Toast() {
  const toast = useToast((s) => s.toast);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 sm:bottom-8" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.text}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`max-w-md rounded-full px-5 py-3 text-sm font-medium shadow-lg ${toast.kind === "error" ? "bg-bad text-white" : "bg-ink text-paper"}`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
