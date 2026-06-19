import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { formatINR, formatArea } from "../lib/format.js";

function ImageCarousel({ images, title }) {
  const [index, setIndex] = useState(0);

  function go(delta, e) {
    e.stopPropagation();
    setIndex((i) => (i + delta + images.length) % images.length);
  }

  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-ink/5 dark:bg-paper/5 flex items-center justify-center text-xs font-mono text-ink/40 dark:text-paper/40">
        No photo
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden crop-marks bg-ink/5">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`${title} — photo ${index + 1}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => go(-1, e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-navy-deep/60 text-paper p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-navy-deep"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={(e) => go(1, e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-navy-deep/60 text-paper p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-navy-deep"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <motion.span
                key={img}
                animate={{ width: i === index ? 16 : 6, opacity: i === index ? 1 : 0.5 }}
                className={`h-1.5 rounded-full ${i === index ? "bg-brass" : "bg-paper/60"}`}
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.35), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group border border-ink/15 dark:border-chalk/20 hover:border-brass hover:shadow-xl hover:shadow-brass/10 transition-all duration-300 cursor-pointer bg-paper dark:bg-navy"
      onClick={() => onOpen(property)}
    >
      <ImageCarousel images={property.images} title={property.title} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-base leading-snug text-ink dark:text-paper group-hover:text-brass transition-colors duration-200">
            {property.title}
          </h3>
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`shrink-0 text-[10px] font-mono uppercase tracking-wide px-2 py-1 border ${
              isAvailable ? "border-moss text-moss" : "border-clay text-clay"
            }`}
          >
            {property.status}
          </motion.span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-mono text-ink/60 dark:text-paper/60">
          <MapPin size={12} />
          {property.location}
          <span className="text-ink/30 dark:text-paper/30">·</span>
          {property.type}
        </div>

        <motion.div
          className="mt-3 font-mono text-lg text-brass"
          whileHover={{ scale: 1.02 }}
        >
          {formatINR(property.price)}
        </motion.div>

        <div className="mt-3 flex items-center gap-4 text-xs font-mono text-ink/70 dark:text-paper/70 border-t border-ink/10 dark:border-chalk/15 pt-3">
          <span className="flex items-center gap-1"><BedDouble size={14} /> {property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Ruler size={14} /> {formatArea(property.area_sqft)}</span>
        </div>
      </div>
    </motion.article>
  );
}