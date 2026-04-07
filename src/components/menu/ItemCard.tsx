import { motion } from "framer-motion";
import { type Item } from "./Menu";

interface Props {
  item: Item;
  index: number;
}

export default function ItemCard({ item, index }: Props) {
  const itemName = item.nameAr || item.name || "";
  const itemIngredients = item.ingredientsAr || item.ingredients || "";
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;

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
          src={item.image ? `/images/${item.image}` : "/logo.png"}
          alt={itemName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
      <div className="p-4 flex flex-col items-center text-center gap-2">
        <h4 className={`text-sm md:text-base font-black leading-tight truncate w-full ${unavailable ? "text-gray-400" : "text-primary"}`}>
          {itemName}
        </h4>

        {itemIngredients && (
          <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed opacity-80 line-clamp-2 h-7 md:h-8">
            {itemIngredients}
          </p>
        )}

        {/* Pricing */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-auto">
          {prices.map((p, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className={`text-xs md:text-sm font-black ${unavailable ? "text-gray-400" : "text-primary"}`}>
                {p.trim()}
              </span>
              <span className="text-[8px] font-bold text-gray-400 mt-0.5">₪</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
