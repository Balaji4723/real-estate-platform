import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BedDouble, Bath, Ruler, MapPin, Trash2 } from "lucide-react";
import { formatINR, formatArea, timeAgo } from "../lib/format.js";
import { api } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

export default function PropertyModal({ property, onClose, onDeleted }) {
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setActiveImage(0);
  }, [property]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!property) return null;

  const images = property.images?.length ? property.images : [];

  async function handleDelete() {
    if (!window.confirm(`Remove "${property.title}" from the listings?`)) return;
    setDeleting(true);
    try {
      await api.deleteProperty(property.id);
      addToast("Listing removed.", "success");
      onDeleted?.(property.id);
      onClose();
    } catch (err) {
      addToast(err.message || "Could not remove this listing.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] bg-navy-deep/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-paper dark:bg-navy w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto border border-ink/10 dark:border-chalk/20"
          role="dialog"
          aria-modal="true"
          aria-label={property.title}
        >
          <div className="relative">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={`${property.title} — photo ${activeImage + 1}`}
                className="w-full aspect-[16/9] object-cover"
              />
            ) : (
              <div className="w-full aspect-[16/9] bg-ink/10 flex items-center justify-center text-ink/40 text-sm font-mono">
                No photo available
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 bg-navy-deep/70 text-paper p-2 hover:bg-navy-deep"
            >
              <X size={18} />
            </button>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-ink/5 dark:bg-paper/5">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 overflow-hidden border-2 ${
                    i === activeImage ? "border-brass" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink dark:text-paper">
                  {property.title}
                </h2>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm font-mono text-ink/60 dark:text-paper/60">
                  <MapPin size={14} />
                  {property.address || property.location}
                </div>
              </div>
              <span
                className={`shrink-0 text-[10px] font-mono uppercase tracking-wide px-2 py-1 border ${
                  property.status === "Available"
                    ? "border-moss text-moss"
                    : "border-clay text-clay"
                }`}
              >
                {property.status}
              </span>
            </div>

            <div className="mt-4 font-mono text-2xl text-brass">
              {formatINR(property.price)}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border border-ink/10 dark:border-chalk/20 p-4">
              <Spec icon={BedDouble} label="Bedrooms" value={property.bedrooms} />
              <Spec icon={Bath} label="Bathrooms" value={property.bathrooms} />
              <Spec icon={Ruler} label="Area" value={formatArea(property.area_sqft)} />
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink/80 dark:text-paper/80">
              {property.description}
            </p>

            <div className="mt-6 flex items-center justify-between text-xs font-mono text-ink/40 dark:text-paper/40 border-t border-ink/10 dark:border-chalk/15 pt-4">
              <span>Listed {timeAgo(property.created_at)}</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 text-clay hover:text-clay/80 disabled:opacity-50"
              >
                <Trash2 size={14} />
                {deleting ? "Removing…" : "Remove listing"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon size={16} className="mx-auto text-brass" />
      <div className="mt-1 font-mono text-sm text-ink dark:text-paper">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wide text-ink/40 dark:text-paper/40">
        {label}
      </div>
    </div>
  );
}
