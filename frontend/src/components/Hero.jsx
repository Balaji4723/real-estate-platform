import { motion } from "framer-motion";
import { ArrowDown, Plus } from "lucide-react";
import StatBlock from "./StatBlock.jsx";
import { useStats } from "../hooks/useProperties.js";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Hero() {
  const stats = useStats();

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy bg-blueprint-grid bg-grid"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/40 via-transparent to-navy-deep/70" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20"
      >
        <motion.p
          variants={item}
          className="font-mono text-xs uppercase tracking-[0.25em] text-chalk mb-5"
        >
          Residential — India
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-4xl sm:text-6xl font-semibold text-paper leading-[1.05] max-w-3xl"
        >
          Find your next address.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-paper/70 font-body text-base sm:text-lg"
        >
          Apartments, villas, flats, and houses across Chennai, Mumbai, Delhi
          and Bangalore — drawn up clearly, priced honestly, and easy to
          search.
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
          <a
            href="#listings"
            className="inline-flex items-center gap-2 bg-brass hover:bg-brass-light text-navy-deep font-body font-medium px-5 py-2.5 transition-colors"
          >
            Browse listings
            <ArrowDown size={16} />
          </a>
          <a
            href="#add-property"
            className="inline-flex items-center gap-2 border border-chalk/50 hover:border-chalk text-paper font-body font-medium px-5 py-2.5 transition-colors"
          >
            <Plus size={16} />
            List your property
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-12">
          <StatBlock stats={stats} />
        </motion.div>
      </motion.div>
    </section>
  );
}
