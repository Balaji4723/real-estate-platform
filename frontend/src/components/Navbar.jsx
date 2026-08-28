import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import CompassMark from "./icons/CompassMark.jsx";
import ModeToggle from "./ModeToggle.jsx";

const LINKS = [
  { href: "#listings", label: "Listings" },
  { href: "#add-property", label: "List a property" },
];

export default function Navbar({ mode, onToggleMode, isAdmin, onLoginClick, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-paper/90 dark:bg-navy-deep/90 border-b border-ink/10 dark:border-chalk/15">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-ink dark:text-paper">
          <CompassMark size={24} />
          <span className="font-display font-semibold tracking-tight text-lg">Sitemap</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}
              className="text-sm font-body text-ink/70 dark:text-paper/70 hover:text-brass transition-colors">
              {link.label}
            </a>
          ))}
          <ModeToggle mode={mode} onToggle={onToggleMode} />
          {isAdmin ? (
            <button onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-clay hover:text-clay/80 transition-colors">
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <button onClick={onLoginClick}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-ink/50 dark:text-paper/50 hover:text-brass transition-colors">
              <LogIn size={14} /> Admin
            </button>
          )}
        </nav>

        <button type="button" className="md:hidden text-ink dark:text-paper"
          onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"}>
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
                <a key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="text-sm font-body text-ink/80 dark:text-paper/80">{link.label}</a>
              ))}
              <ModeToggle mode={mode} onToggle={onToggleMode} />
              {isAdmin ? (
                <button onClick={() => { onLogout(); setOpen(false); }}
                  className="text-left text-sm font-mono text-clay">Logout admin</button>
              ) : (
                <button onClick={() => { onLoginClick(); setOpen(false); }}
                  className="text-left text-sm font-mono text-ink/50 dark:text-paper/50">Admin login</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
