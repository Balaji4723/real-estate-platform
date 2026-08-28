import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Loader2 } from "lucide-react";
import { api } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

export default function AdminLogin({ onLogin, onClose }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(password);
      addToast("Logged in as admin.", "success");
      onLogin(data.token);
      onClose();
    } catch (err) {
      addToast(err.message || "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] bg-navy-deep/70 backdrop-blur-sm flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-paper dark:bg-navy border border-ink/10 dark:border-chalk/20 p-8 w-full max-w-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Admin Login"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 font-display font-semibold text-ink dark:text-paper">
              <Lock size={18} className="text-brass" />
              Admin Login
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-ink/40 hover:text-ink dark:text-paper/40 dark:hover:text-paper"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-ink/60 dark:text-paper/60 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-transparent border border-ink/20 dark:border-chalk/30 px-3 py-2.5 text-sm focus:border-brass transition-colors text-ink dark:text-paper"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brass hover:bg-brass-light text-navy-deep font-medium py-2.5 transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
