import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useMenu } from "../context/MenuContext";
import CategorySection from "../components/menu/CategorySection";
import Footer from "../components/menu/footer";
import FeedbackModal from "../components/menu/FeedbackModal";
import LoadingScreen from "../components/common/LoadingScreen";

const BACK_TRANSITION_MS = 2000;

export default function CategoryItemsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { menuData, hasLoaded, complaintsWhatsapp } = useMenu();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to top instantly on every category change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Handle back button: show loader for 2s, then navigate
  const handleBack = useCallback(() => {
    if (isGoingBack) return; // prevent double-tap
    setIsGoingBack(true);

    timerRef.current = setTimeout(() => {
      navigate("/");
    }, BACK_TRANSITION_MS);
  }, [isGoingBack, navigate]);

  const category = useMemo(() => menuData?.categories.find((c) => c.id === id), [menuData, id]);
  const items = useMemo(() => menuData?.items.filter((i) => i.categoryId === id && i.visible !== false) || [], [menuData, id]);
  const subcategories = useMemo(() => menuData?.subcategories.filter((s) => s.categoryId === id) || [], [menuData, id]);

  // Guard: wait for global data to load
  if (!hasLoaded) return <LoadingScreen visible={true} />;

  if (!category) return <div className="text-center p-20 text-xl font-bold">{t('common.not_found')}</div>;

  return (
    <div className="min-h-screen bg-white text-primary font-['Cairo'] flex flex-col">

      {/* ═══════ Back-Navigation Loading Overlay ═══════ */}
      <AnimatePresence>
        {isGoingBack && (
          <motion.div
            key="back-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white select-none"
            style={{ pointerEvents: "all" }}
          >
            {/* Soft radial background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(29,62,153,0.06) 0%, transparent 70%)",
              }}
            />

            {/* Animated ring + logo */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Spinning arc */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="72" stroke="rgba(29,62,153,0.08)" strokeWidth="2" fill="none" />
                <motion.circle
                  cx="80" cy="80" r="72"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 72 * 0.3} ${2 * Math.PI * 72 * 0.7}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "80px 80px" }}
                />
              </svg>
              {/* Logo */}
              <motion.div
                className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-xl border border-primary/10 shadow-xl flex items-center justify-center p-4 overflow-hidden"
                animate={{ scale: [0.97, 1.03, 0.97] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
              </motion.div>
            </div>

            {/* Animated dots text */}
            <motion.div
              className="mt-8 flex items-center gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-primary/70 font-bold text-sm tracking-widest uppercase">
                {isRtl ? "جارٍ العودة" : "Going back"}
              </span>
              {/* Three bouncing dots */}
              <span className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary font-black hover:opacity-70 transition-opacity"
        >
          {isRtl ? <FiArrowRight size={24} /> : <FiArrowLeft size={24} />}
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
