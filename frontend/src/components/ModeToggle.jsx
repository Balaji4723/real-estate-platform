import { motion } from "framer-motion";
import CompassMark from "./icons/CompassMark.jsx";

export default function ModeToggle({ mode, onToggle }) {
  const isBlueprint = mode === "blueprint";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="group flex items-center gap-2 border border-ink/15 dark:border-chalk/30 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-ink/70 dark:text-paper/70 hover:border-brass hover:text-brass transition-colors"
      aria-pressed={isBlueprint}
      title="Switch between paper and blueprint view"
    >
      <motion.span
        animate={{ rotate: isBlueprint ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className="inline-flex"
      >
        <CompassMark size={16} />
      </motion.span>
      {isBlueprint ? "Blueprint" : "Paper"}
    </button>
  );
}
