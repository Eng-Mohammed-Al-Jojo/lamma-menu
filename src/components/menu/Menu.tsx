import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import MenuSkeleton from "./MenuSkeleton";
import { MenuService } from "../../services/menuService";

import CategoryCard from "./CategoryCard";

/* ================= Types ================= */
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  available?: boolean;
  order?: number;
  image?: string;
  visible?: boolean;
}

export interface Subcategory {
  id: string;
  nameAr: string;
  nameEn?: string;
  categoryId: string;
  image?: string;
  visible?: boolean;
  order?: number;
}

export interface Item {
  featured: any;
  image: string | undefined;
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  price: number;
  ingredients?: string;
  ingredientsAr?: string;
  ingredientsEn?: string;
  priceTw?: number;
  categoryId: string;
  subcategoryId?: string | null;
  visible?: boolean;
  star?: boolean;
  createdAt?: number;
  order?: number;
}

/* ================= Props ================= */
interface Props {
  onLoadingChange?: (loading: boolean) => void;
  onHasFeaturedItems?: (hasFeatured: boolean) => void;
}

/**
 * Loading phases:
 *   "loading"  → Firebase data is still being fetched
 *   "skeleton" → Data arrived, Skeleton shown for 800ms
 *   "ready"    → Full menu rendered
 */
type LoadingPhase = "loading" | "skeleton" | "ready";

const SKELETON_DURATION = 1000;
const MIN_LOADING_DURATION = 2500;

export default function Menu({ onLoadingChange, onHasFeaturedItems }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [phase, setPhase] = useState<LoadingPhase>("loading");
  const isMounted = useRef(true);

  /* ================= Data Fetching ================= */
  useEffect(() => {
    isMounted.current = true;
    onLoadingChange?.(true);

    let unsubscribe: (() => void) | null = null;

    const loadData = async () => {
      const startTime = Date.now();

      try {
        const { data } = await MenuService.getMenuWithFallback();
        if (!isMounted.current) return;

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(MIN_LOADING_DURATION - elapsed, 0);

        setTimeout(() => {
          if (!isMounted.current) return;

          setCategories(data.categories);
          onHasFeaturedItems?.(data.items.some(item => item.star === true && item.visible !== false));
          onLoadingChange?.(false);
          setPhase("skeleton");

          setTimeout(() => {
            if (isMounted.current) {
              setPhase("ready");
            }
          }, SKELETON_DURATION);

        }, remainingTime);

        unsubscribe = MenuService.subscribeToMenuUpdates((freshData) => {
          if (!isMounted.current) return;
          setCategories(freshData.categories);
          onHasFeaturedItems?.(freshData.items.some(item => item.star === true && item.visible !== false));
        });

      } catch (err) {
        console.error("Menu load failed:", err);
        if (isMounted.current) {
          onLoadingChange?.(false);
          setPhase("ready");
        }
      }
    };

    loadData();

    return () => {
      isMounted.current = false;
      unsubscribe?.();
    };
  }, []);

  const availableCategories = useMemo(() =>
    categories.filter(cat => cat.available && cat.visible !== false),
    [categories]);

  if (phase === "loading") return null;

  if (phase === "skeleton") {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <MenuSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto pb-20 px-4"
    >


      <div className="flex flex-col gap-6 sm:gap-10">
        {availableCategories.map((cat, index) => (
          <CategoryCard key={cat.id} category={cat} index={index} />
        ))}
      </div>
    </motion.div>
  );
}