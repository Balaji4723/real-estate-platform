import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import CompassMark from "./icons/CompassMark.jsx";
import ModeToggle from "./ModeToggle.jsx";

const LINKS = [
  { href: "#listings", label: "Listings" },
  { href: "#add-property", label: "List a property" },
];

export default function Navbar({ mode, onToggleMode }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-paper/90 dark:bg-navy-deep/90 border-b border-ink/10 dark:border-chalk/15">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-ink dark:text-paper">
          <CompassMark size={24} />
          <span className="font-display font-semibold tracking-tight text-lg">
            Sitemap
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-body text-ink/70 dark:text-paper/70 hover:text-brass transition-colors"
            >
              {link.label}
            </a>
          ))}
          <ModeToggle mode={mode} onToggle={onToggleMode} />
        </nav>

        <button
          type="button"
          className="md:hidden text-ink dark:text-paper"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-ink/10 dark:border-chalk/15"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-body text-ink/80 dark:text-paper/80"
                >
                  {link.label}
                </a>
              ))}
              <ModeToggle mode={mode} onToggle={onToggleMode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
