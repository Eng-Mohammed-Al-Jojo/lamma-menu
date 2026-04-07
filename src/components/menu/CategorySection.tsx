import { useMemo } from "react";
import ItemCard from "./ItemCard";
import type { Category, Item, Subcategory } from "./Menu";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface Props {
  category: Category;
  subcategories: Subcategory[];
  items: Item[];
  orderSystem?: boolean; // Kept for type compatibility but unused
  index?: number;
}

export default function CategorySection({ category, subcategories, items }: Props) {
  const { i18n } = useTranslation();

  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    const noSubItems: Item[] = [];

    items.forEach(item => {
      const sub = subcategories.find(s => s.id === item.subcategoryId);
      if (item.subcategoryId && sub) {
        if (sub.visible === false) return;
        if (!groups[item.subcategoryId]) groups[item.subcategoryId] = [];
        groups[item.subcategoryId].push(item);
      } else {
        noSubItems.push(item);
      }
    });

    return { groups, noSubItems };
  }, [items, subcategories]);

  const activeSubcategories = useMemo(() => {
    return subcategories
      .filter(sub => sub.categoryId === category.id && sub.visible !== false && groupedItems.groups[sub.id])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [category.id, subcategories, groupedItems.groups]);

  if (category.visible === false) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col gap-12 pb-16"
    >
      <div className="flex flex-col gap-12">
        {/* بدون sub */}
        {groupedItems.noSubItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {groupedItems.noSubItems.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}

        {/* مع sub */}
        {activeSubcategories.map((sub) => (
          <div key={sub.id} className="flex flex-col gap-8">
            {/* Subcategory Title */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-primary">
                {i18n.language === 'en' ? (sub.nameEn || sub.nameAr) : sub.nameAr}
              </h3>
              <div className="h-1.5 w-12 bg-primary/20 rounded-full" />
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {groupedItems.groups[sub.id].map((item, iIdx) => (
                <ItemCard key={item.id} item={item} index={iIdx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}