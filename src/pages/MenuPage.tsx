import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";
import LoadingScreen from "../components/common/LoadingScreen";
import { motion } from "framer-motion";
import FeedbackModal from "../components/menu/FeedbackModal";

export default function MenuPage() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [complaintsWhatsapp, setComplaintsWhatsapp] = useState("");

  useEffect(() => {
    const complaintsRef = ref(db, "settings/complaintsWhatsapp");
    const unsub = onValue(complaintsRef, (snapshot) => {
      const value = snapshot.val();
      setComplaintsWhatsapp(value ? String(value).trim() : "");
    });
    return () => unsub();
  }, []);

  // Called by Menu when Firebase fetch completes → triggers LoadingScreen fade-out
  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen flex flex-col bg-main text-primary font-['Cairo'] relative">

      {/* ✅ Global Loading Screen — controlled by data fetch state */}
      <LoadingScreen visible={isLoading} />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-80 bg-linear-to-b from-primary/10 to-transparent pointer-events-none"></div>

      {/* Content */}
      <main className="relative z-10 flex flex-col min-h-screen pb-20">

        {/* Hero Banner Area */}
        <div className="relative w-full h-[35vh] md:h-[45vh] flex flex-col items-center justify-center text-center overflow-visible">

          {/* Main Banner Image with Seamless Fade Mask */}
          <div
            className="absolute inset-x-0 top-0 h-full pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
            }}
          >
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src="/logo.png"
              className="w-full h-full object-cover"
            />
            {/* Premium Gradient Overlays for Text Legibility */}
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="absolute inset-0 bg-linear-to-b from-white/40 via-white/10 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 space-y-6 px-4 max-w-4xl mx-auto -mt-6 md:-mt-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-6"
            >
              {/* Floating Logo Container */}
              <div className="w-24 h-24 md:w-32 md:h-32 p-4 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl mx-auto group hover:scale-105 transition-transform duration-500 ring-1 ring-white/10">
                <img src="/logo.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Logo" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight">
                  {t("menu.title")}
                </h1>

                <div className="inline-block px-5 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 shadow-lg">
                  <p className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                    {t("menu.subtitle")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Menu Component (Categories Grid) */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 mt-4">
          <Menu
            onLoadingChange={handleLoadingChange}
          />
        </div>

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