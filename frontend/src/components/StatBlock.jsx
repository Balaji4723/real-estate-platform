import { useCountUp } from "../hooks/useCountUp.js";
import { formatINR } from "../lib/format.js";

function Cell({ label, value, suffix = "" }) {
  return (
    <div className="flex-1 min-w-[110px] border border-chalk/30 px-4 py-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-chalk/80">
        {label}
      </div>
      <div className="font-mono text-xl sm:text-2xl text-paper mt-1">
        {value}
        {suffix}
      </div>
    </div>
  );
}

export default function StatBlock({ stats }) {
  const properties = useCountUp(stats?.totalProperties ?? 0);
  const cities = useCountUp(stats?.totalCities ?? 0);
  const available = useCountUp(stats?.totalAvailable ?? 0);

  return (
    <div className="flex flex-wrap gap-px sm:gap-0 sm:border sm:border-chalk/30">
      <Cell label="Listings" value={Math.round(properties)} />
      <Cell label="Cities" value={Math.round(cities)} />
      <Cell label="Live now" value={Math.round(available)} />
      <Cell
        label="Avg. price"
        value={stats?.avgPrice ? formatINR(stats.avgPrice) : "—"}
      />
    </div>
  );
}
