import { useState } from "react";
import { motion } from "framer-motion";
import { type Item } from "./Menu";
import ImageModal from "../common/ImageModal";

interface Props {
  item: Item;
  index: number;
}

export default function ItemCard({ item, index }: Props) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const itemName = item.nameAr || item.name || "";
  const itemIngredients = item.ingredientsAr || item.ingredients || "";
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;

  const imageSrc = item.image ? `/images/${item.image}` : "/logo.png";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`relative group flex flex-col bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 border-3 border-gray-200 ${unavailable ? "opacity-60 grayscale-[0.8]" : "hover:border-primary/20 hover:-translate-y-1"
        }`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageSrc}
          alt={itemName}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!unavailable ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (!unavailable) setIsImageModalOpen(true);
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo.png";
          }}
        />

        {unavailable && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center p-2">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex flex-col items-center text-center gap-2.5">
        <h4 className={`text-sm md:text-base font-black leading-tight line-clamp-2 w-full wrap-break-word ${unavailable ? "text-gray-400" : "text-primary"}`}>
          {itemName}
        </h4>

        {itemIngredients && (
          <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed opacity-80 line-clamp-2 w-full wrap-break-word">
            {itemIngredients}
          </p>
        )}

        {/* ── Price Badge(s) ─────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-auto w-full">
          {prices.length === 1 ? (
            /* Single price — soft badge */
            <div
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border text-sm font-black transition-colors duration-200 ${
                unavailable
                  ? "bg-gray-100 text-gray-400 border-gray-200"
                  : "bg-primary/8 text-primary border-primary/15 group-hover:bg-primary/12"
              }`}
            >
              <span>{prices[0].trim()}</span>
              <span className="text-xs font-bold opacity-60">₪</span>
            </div>
          ) : (
            /* Multiple prices — compact row */
            prices.map((p, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg border text-[11px] md:text-xs font-bold ${
                  unavailable
                    ? "bg-gray-100 text-gray-400 border-gray-200"
                    : "bg-primary/8 text-primary border-primary/15"
                }`}
              >
                <span>{p.trim()}</span>
                <span className="opacity-50">₪</span>
              </div>
            ))
          )}
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={imageSrc}
        altText={itemName}
        itemName={itemName}
        itemIngredients={itemIngredients}
        prices={prices}
        unavailable={unavailable}
      />
    </motion.div>
  );
}
