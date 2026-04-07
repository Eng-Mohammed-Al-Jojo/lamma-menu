import { type Item } from "./Menu";
import React from "react";
import { FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  item: Item;
}

const ItemRow = React.memo(({ item }: Props) => {
  const { t } = useTranslation();
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;

  const itemName = item.nameAr || "";
  const itemIngredients = item.ingredientsAr || "";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white backdrop-blur-md rounded-3xl border border-gray-100 transition-all duration-500 ${
        unavailable ? "opacity-60 grayscale-[0.8]" : "hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:bg-gray-50/50"
      }`}
    >
      {/* Image Section */}
      <div className="relative shrink-0 overflow-hidden rounded-2xl border border-gray-50 w-full sm:w-24 h-48 sm:h-24 bg-gray-50">
        <img
          src={item.image ? `/images/${item.image}` : "/logo.png"}
          alt={itemName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo.png";
          }}
        />
        {unavailable && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
              {t('common.unavailable')}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Top Row: Name & Star */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`text-base md:text-lg font-black leading-tight truncate ${unavailable ? "text-gray-400" : "text-primary"}`}>
                {itemName}
              </h3>
              {item.star && <FiStar className="text-amber-400 fill-amber-400 shrink-0" size={14} />}
            </div>
            
            {/* Ingredients */}
            {itemIngredients && (
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed opacity-80 line-clamp-2">
                {itemIngredients}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-base sm:text-xl font-black ${unavailable ? "text-gray-400" : "text-primary"}`}>
                {prices.map((p) => p.trim()).join(" - ")}
              </span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">₪</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ItemRow;
