import CompassMark from "./icons/CompassMark.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 dark:border-chalk/15 mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-ink/50 dark:text-paper/50">
        <div className="flex items-center gap-2">
          <CompassMark size={16} />
          Sitemap — Real Estate Listings
        </div>
        <span>Built for finding home, one listing at a time.</span>
      </div>
    </footer>
  );
}
