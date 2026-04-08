import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import MenuSkeleton from "./MenuSkeleton";
import { useMenu } from "../../context/MenuContext";

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
}

/**
 * Loading phases:
 *   "loading"  → Firebase data is still being fetched
 *   "skeleton" → Data arrived, Skeleton shown for duration
 *   "ready"    → Full menu rendered
 */
type LoadingPhase = "loading" | "skeleton" | "ready";

const SKELETON_DURATION = 1000;
const MIN_LOADING_DURATION = 2000; // Slightly reduced for better feel

export default function Menu({ onLoadingChange }: Props) {
  const { menuData, isLoading: contextLoading, hasLoaded } = useMenu();
  // Capture hasLoaded at mount: if true, data was already cached – skip entrance animation
  const wasAlreadyLoaded = hasLoaded;
  const [phase, setPhase] = useState<LoadingPhase>(hasLoaded ? "ready" : "loading");
  const isMounted = useRef(true);

  /* ================= Phase Management ================= */
  useEffect(() => {
    isMounted.current = true;

    // SCENARIO 1: Data is already loaded (returning to this page)
    if (hasLoaded && menuData) {
      setPhase("ready");
      onLoadingChange?.(false);
      return;
    }

    // SCENARIO 2: First-time load from context
    if (!contextLoading && menuData) {
      onLoadingChange?.(true);
      setPhase("loading");

      const sequence = async () => {
        // Wait for minimum duration for "brand experience" on first load only
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_DURATION));
        if (!isMounted.current) return;
        
        onLoadingChange?.(false);
        setPhase("skeleton");

        await new Promise(resolve => setTimeout(resolve, SKELETON_DURATION));
        if (isMounted.current) {
          setPhase("ready");
        }
      };

      sequence();
    }

    return () => {
      isMounted.current = false;
    };
  }, [contextLoading, menuData, hasLoaded]);

  const categories = useMemo(() => menuData?.categories || [], [menuData]);
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
      initial={wasAlreadyLoaded ? false : { opacity: 0, y: 20 }}
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