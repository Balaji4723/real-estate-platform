import { Search, RotateCcw } from "lucide-react";

export const PRICE_BANDS = [
  { key: "", label: "Any price" },
  { key: "0-5000000", label: "Under ₹50 L" },
  { key: "5000000-10000000", label: "₹50 L – ₹1 Cr" },
  { key: "10000000-20000000", label: "₹1 Cr – ₹2 Cr" },
  { key: "20000000-", label: "Above ₹2 Cr" },
];

const BEDROOM_OPTIONS = [
  { key: "", label: "Any beds" },
  { key: "1", label: "1+ bed" },
  { key: "2", label: "2+ beds" },
  { key: "3", label: "3+ beds" },
  { key: "4", label: "4+ beds" },
];

function Select({ value, onChange, options, label }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="border border-ink/20 dark:border-chalk/30 bg-transparent text-xs font-mono uppercase tracking-wide px-3 py-2 text-ink/80 dark:text-paper/80 hover:border-brass focus:border-brass transition-colors cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.key} value={opt.key} className="bg-paper dark:bg-navy text-ink dark:text-paper">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function FilterBar({
  search,
  onSearchChange,
  location,
  onLocationChange,
  locations,
  type,
  onTypeChange,
  types,
  priceBand,
  onPriceBandChange,
  bedrooms,
  onBedroomsChange,
  onReset,
  hasActiveFilters,
}) {
  const locationOptions = [{ key: "", label: "All cities" }, ...locations.map((l) => ({ key: l, label: l }))];
  const typeOptions = [{ key: "", label: "All types" }, ...types.map((t) => ({ key: t, label: t }))];

  return (
    <div className="border border-ink/15 dark:border-chalk/20 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by city, locality or type…"
            className="w-full bg-transparent border border-ink/20 dark:border-chalk/30 pl-9 pr-3 py-2.5 text-sm font-body placeholder:text-ink/40 dark:placeholder:text-paper/40 focus:border-brass transition-colors"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-clay hover:text-clay/80 shrink-0"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Select value={location} onChange={onLocationChange} options={locationOptions} label="Filter by city" />
        <Select value={type} onChange={onTypeChange} options={typeOptions} label="Filter by property type" />
        <Select value={priceBand} onChange={onPriceBandChange} options={PRICE_BANDS} label="Filter by price" />
        <Select value={bedrooms} onChange={onBedroomsChange} options={BEDROOM_OPTIONS} label="Filter by bedrooms" />
      </div>
    </div>
  );
}
