import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { formatINR, formatArea } from "../lib/format.js";

function ImageCarousel({ images, title }) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length ? images : [];

  function go(delta) {
    setIndex((i) => (i + delta + safeImages.length) % safeImages.length);
  }

  if (!safeImages.length) {
    return (
      <div className="aspect-[4/3] bg-ink/5 dark:bg-paper/5 flex items-center justify-center text-xs font-mono text-ink/40 dark:text-paper/40">
        No photo available
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden crop-marks bg-ink/5">
      <AnimatePresence mode="wait">
        <motion.img
          key={safeImages[index]}
          src={safeImages[index]}
          alt={`${title} — photo ${index + 1} of ${safeImages.length}`}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-navy-deep/60 text-paper p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-navy-deep/60 text-paper p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {safeImages.map((img, i) => (
              <span
                key={img}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === index ? "bg-brass" : "bg-paper/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PropertyCard({ property, onOpen, index = 0 }) {
  const isAvailable = property.status === "Available";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group border border-ink/15 dark:border-chalk/20 hover:border-brass transition-colors cursor-pointer"
      onClick={() => onOpen(property)}
    >
      <ImageCarousel images={property.images} title={property.title} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-base leading-snug text-ink dark:text-paper">
            {property.title}
          </h3>
          <span
            className={`shrink-0 text-[10px] font-mono uppercase tracking-wide px-2 py-1 border ${
              isAvailable
                ? "border-moss text-moss"
                : "border-clay text-clay"
            }`}
          >
            {property.status}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-mono text-ink/60 dark:text-paper/60">
          <MapPin size={12} />
          {property.location}
          <span className="text-ink/30 dark:text-paper/30">·</span>
          {property.type}
        </div>

        <div className="mt-3 font-mono text-lg text-brass">
          {formatINR(property.price)}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs font-mono text-ink/70 dark:text-paper/70 border-t border-ink/10 dark:border-chalk/15 pt-3">
          <span className="flex items-center gap-1">
            <BedDouble size={14} /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={14} /> {formatArea(property.area_sqft)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
