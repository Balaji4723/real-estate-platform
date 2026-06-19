import { SearchX } from "lucide-react";

export default function EmptyState({ onReset }) {
  return (
    <div className="col-span-full border border-dashed border-ink/20 dark:border-chalk/25 py-16 px-6 text-center">
      <SearchX size={28} className="mx-auto text-ink/30 dark:text-paper/30" />
      <p className="mt-3 font-display text-lg text-ink dark:text-paper">
        No listings match this search.
      </p>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
        Try a different city, type, or price range.
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 text-sm font-mono uppercase tracking-wide text-brass hover:text-brass-light"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
