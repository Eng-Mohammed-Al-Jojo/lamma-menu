import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { MenuService, type MenuData } from "../services/menuService";
import CategorySection from "../components/menu/CategorySection";
import LoadingScreen from "../components/common/LoadingScreen";
import Footer from "../components/menu/footer";
import FeedbackModal from "../components/menu/FeedbackModal";

export default function CategoryItemsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [complaintsWhatsapp, setComplaintsWhatsapp] = useState("");

  useEffect(() => {
    let unsubscribeMenu: (() => void) | null = null;

    const loadData = async () => {
      try {
        const { data: menuData } = await MenuService.getMenuWithFallback();
        setData(menuData);

        unsubscribeMenu = MenuService.subscribeToMenuUpdates((freshData) => {
          setData(freshData);
        });
      } catch (err) {
        console.error("Failed to load category data:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    loadData();

    // Complaints Whatsapp fetch
    const complaintsRef = ref(db, "settings/complaintsWhatsapp");
    const unsubComplaints = onValue(complaintsRef, (snapshot) => {
      const value = snapshot.val();
      setComplaintsWhatsapp(value ? String(value).trim() : "");
    });

    return () => {
      unsubComplaints();
      if (unsubscribeMenu) unsubscribeMenu();
    };
  }, []);

  const category = useMemo(() => data?.categories.find((c) => c.id === id), [data, id]);
  const items = useMemo(() => data?.items.filter((i) => i.categoryId === id && i.visible !== false) || [], [data, id]);
  const subcategories = useMemo(() => data?.subcategories.filter((s) => s.categoryId === id) || [], [data, id]);

  if (isLoading) return <LoadingScreen visible={true} />;
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
