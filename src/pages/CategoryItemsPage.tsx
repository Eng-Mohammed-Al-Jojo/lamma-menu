import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useMenu } from "../context/MenuContext";
import CategorySection from "../components/menu/CategorySection";
import Footer from "../components/menu/footer";
import FeedbackModal from "../components/menu/FeedbackModal";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/common/LoadingScreen";

export default function CategoryItemsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const { menuData, hasLoaded, complaintsWhatsapp } = useMenu();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // 1. Scroll Reset & Forward Transition
  useEffect(() => {
    // Always start at top
    window.scrollTo({ top: 0, behavior: "instant" });
    
    // Brief deliberate loading screen when entering items
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const category = useMemo(() => menuData?.categories.find((c) => c.id === id), [menuData, id]);
  const items = useMemo(() => menuData?.items.filter((i) => i.categoryId === id && i.visible !== false) || [], [menuData, id]);
  const subcategories = useMemo(() => menuData?.subcategories.filter((s) => s.categoryId === id) || [], [menuData, id]);

  // 2. Global First-Load Loading
  if (!hasLoaded) return <LoadingScreen visible={true} />;

  // 3. Page Transition Loading (Forward only)
  if (isTransitioning) return <LoadingScreen visible={true} />;

  if (!category) return <div className="text-center p-20 text-xl font-bold">{t('common.not_found')}</div>;

  return (
    <div className="min-h-screen bg-white text-primary font-['Cairo'] flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary font-black hover:opacity-70 transition-opacity"
        >
          {i18n.language === 'ar' ? <FiArrowRight size={24} /> : <FiArrowLeft size={24} />}
          <span>{t('common.back')}</span>
        </button>
        <h1 className="text-xl font-black">{category.nameAr || category.name}</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <CategorySection
            category={category}
            items={items}
            subcategories={subcategories}
            orderSystem={false}
          />
        </motion.div>
      </main>

      {complaintsWhatsapp !== "" && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          complaintsWhatsapp={complaintsWhatsapp}
        />
      )}
      <Footer
        onOpenFeedback={() => setShowFeedbackModal(true)}
        complaintsWhatsapp={complaintsWhatsapp}
      />
    </div>
  );
}
