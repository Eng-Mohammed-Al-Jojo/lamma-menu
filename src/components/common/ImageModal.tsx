import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText?: string;
  // Optional product detail props — UI only
  itemName?: string;
  itemIngredients?: string;
  prices?: string[];
  unavailable?: boolean;
  categoryName?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  altText,
  itemName,
  itemIngredients,
  prices,
  unavailable,
  categoryName,
}: ImageModalProps) {
  // ─── Logic untouched ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;
  // ──────────────────────────────────────────────────────────────────────────

  const hasDetails = itemName || itemIngredients || (prices && prices.length > 0);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            className="relative z-10 w-full sm:max-w-sm mx-auto rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl"
            style={{ maxHeight: "90dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── IMAGE — fills most of the modal ── */}
            <div className="relative w-full bg-black" style={{ aspectRatio: "3/4", maxHeight: "75dvh" }}>
              <motion.img
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                src={imageSrc}
                alt={altText}
                className={`w-full h-full object-cover ${unavailable ? "grayscale-[0.5] opacity-80" : ""}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />

              {/* Strong gradient at bottom so text is readable on image */}
              {hasDetails && (
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200 backdrop-blur-sm border border-white/10"
                aria-label="Close"
              >
                <FiX size={17} />
              </button>

              {/* Unavailable overlay */}
              {unavailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="bg-red-500/90 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                    غير متوفر
                  </span>
                </div>
              )}

              {/* ── Details overlaid on bottom of image ── */}
              {hasDetails && (
                <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-8 flex flex-col gap-2" dir="rtl">

                  {/* Category badge */}
                  {categoryName && (
                    <span className="self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-white/20 text-white border border-white/25 backdrop-blur-sm">
                      {categoryName}
                    </span>
                  )}

                  {/* Product Name */}
                  {itemName && (
                    <h2 className="text-white text-xl font-black leading-snug drop-shadow-md">
                      {itemName}
                    </h2>
                  )}

                  {/* Ingredients — subtle, single line */}
                  {itemIngredients && (
                    <p className="text-white/75 text-xs font-medium leading-relaxed line-clamp-2">
                      {itemIngredients}
                    </p>
                  )}

                  {/* Price Badge(s) */}
                  {prices && prices.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {prices.length === 1 ? (
                        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl font-black text-base backdrop-blur-sm border shadow-sm ${
                          unavailable
                            ? "bg-white/20 text-white/60 border-white/20"
                            : "bg-white text-primary border-white/80"
                        }`}>
                          <span>{prices[0].trim()}</span>
                          <span className="text-sm font-bold opacity-60">₪</span>
                        </div>
                      ) : (
                        prices.map((p, idx) => (
                          <div
                            key={idx}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl font-bold text-sm backdrop-blur-sm border ${
                              unavailable
                                ? "bg-white/20 text-white/60 border-white/20"
                                : "bg-white text-primary border-white/80"
                            }`}
                          >
                            <span>{p.trim()}</span>
                            <span className="text-xs opacity-50">₪</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
