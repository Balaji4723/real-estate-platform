import PropertyCard from "./PropertyCard.jsx";
import CardSkeleton from "./CardSkeleton.jsx";
import EmptyState from "./EmptyState.jsx";

export default function PropertyGrid({ properties, loading, error, onOpen, onReset }) {
  if (error) {
    return (
      <div className="border border-clay/40 bg-clay/5 text-clay px-5 py-4 text-sm">
        Couldn't load listings: {error}. Make sure the backend server is running on
        port 5050.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {loading &&
        Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}

      {!loading && properties.length === 0 && <EmptyState onReset={onReset} />}

      {!loading &&
        properties.map((property, i) => (
          <PropertyCard key={property.id} property={property} onOpen={onOpen} index={i} />
        ))}
    </div>
  );
}
