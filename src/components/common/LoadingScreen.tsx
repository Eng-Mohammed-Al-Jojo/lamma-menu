import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
    visible: boolean;
    onExited?: () => void;
    duration?: number; // مدة التحميل بالميلي ثانية
}

export default function FancyLoading({ visible, onExited, duration = 2000 }: Props) {
    const [show, setShow] = useState(visible);

    useEffect(() => {
        if (visible) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                if (onExited) onExited();
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [visible, duration, onExited]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="fancy-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-white to-gray-100 shadow-lg"
                >
                    {/* Animated Logo */}
                    <motion.div
                        className="w-36 h-36 mb-6 rounded-full bg-white/70 backdrop-blur-lg border border-primary/30 shadow-xl flex items-center justify-center p-4"
                        animate={{ scale: [0.9, 1.05, 0.95, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-28 h-28 object-contain"
                        />
                    </motion.div>

                    {/* Loading Dots */}
                    <motion.div className="flex gap-2 mt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="w-3 h-3 rounded-full"
                                style={{ background: `linear-gradient(135deg, var(--color-primary), #93c5fd)` }}
                                animate={{ y: [0, -10, 0], scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            />
                        ))}
                    </motion.div>

                    {/* Loading Text */}
                    <motion.span
                        className="mt-4 text-primary font-extrabold tracking-wide text-lg text-center"
                        style={{ textShadow: "0 0 10px rgba(59,130,246,0.4)" }}
                        animate={{ opacity: [0.5, 1, 0.5], y: [0, -2, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                    >
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}