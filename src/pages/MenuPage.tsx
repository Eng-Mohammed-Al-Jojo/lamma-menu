import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";
import LoadingScreen from "../components/common/LoadingScreen";
import { motion } from "framer-motion";
import FeedbackModal from "../components/menu/FeedbackModal";
import FeaturedModal from "../components/menu/FeaturedModal";
import { Flame } from "lucide-react";
import { useMenu } from "../context/MenuContext";

export default function MenuPage() {
  const { t } = useTranslation();
  const { complaintsWhatsapp, hasFeaturedItems, hasLoaded } = useMenu();

  // Only show loading screen if data isn't cached yet
  // Use a ref to capture the initial value — avoids reacting to context updates
  const initiallyLoaded = useRef(hasLoaded);
  const [isLoading, setIsLoading] = useState(!initiallyLoaded.current);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);

  // Only scroll to top on FIRST visit, not on back-navigation
  // hasLoaded = true means data was cached → user is returning → preserve scroll
  useEffect(() => {
    if (!initiallyLoaded.current) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen flex flex-col bg-main text-primary font-['Cairo'] relative">

      {/* Loading Screen */}
      <LoadingScreen visible={isLoading} />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-80 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* Featured button — fixed to viewport, not relative to any container */}
      {hasFeaturedItems && (
        <motion.div
          className="fixed top-5 left-5 z-40"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", damping: 16, stiffness: 280 }}
        >
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, #2952c4, #1D3E99)" }}
          />

          <button
            onClick={() => setShowFeatured(true)}
            className="relative w-14 h-14 rounded-full outline-none flex items-center justify-center group transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-primary/40"
            style={{
              background: "linear-gradient(145deg, #2952c4 0%, #1D3E99 60%, #162e7a 100%)",
              boxShadow: "0 6px 24px -4px rgba(29,62,153,0.6), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Inner glow ring */}
            <span className="absolute inset-[3px] rounded-full border border-white/10 pointer-events-none" />

            <Flame
              className="relative text-amber-400 group-hover:text-amber-300 transition-colors duration-200"
              style={{ filter: "drop-shadow(0 0 7px rgba(251,191,36,0.8))" }}
              size={24}
              fill="currentColor"
              strokeWidth={1}
            />
          </button>
        </motion.div>
      )}

      {/* Content */}
      <main className="relative z-10 flex flex-col min-h-screen pb-20">

        {/* Hero Banner */}
        <div className="relative w-full h-[35vh] md:h-[45vh] flex flex-col items-center justify-center text-center overflow-visible">
          <div
            className="absolute inset-x-0 top-0 h-full pointer-events-none"
            style={{
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            }}
          >
            <motion.img
              initial={hasLoaded ? false : { scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src="/logo.png"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-linear-to-b from-white/40 via-white/10 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 space-y-6 px-4 max-w-4xl mx-auto mt-6 md:mt-10">
            <motion.div
              initial={hasLoaded ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-0"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 p-4 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border-2 border-primary/10 shadow-2xl mx-auto group hover:scale-105 transition-transform duration-500 ring-1 ring-primary/10">
                <img src="/logo.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Logo" />
              </div>

              <div className="space-y-3">
                <div className="inline-block mt-16 px-5 py-2 rounded-full bg-primary/50 backdrop-blur-md border border-primary/10 shadow-lg">
                  <p className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                    {t("menu.subtitle")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-1 md:px-6 mt-4">
          <Menu onLoadingChange={handleLoadingChange} />
        </div>
      </main>

      <FeaturedModal show={showFeatured} onClose={() => setShowFeatured(false)} />

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