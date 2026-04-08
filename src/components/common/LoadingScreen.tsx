import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
    visible: boolean;          // مرتبط ب hasLoaded
    onExited?: () => void;
    minimumDuration?: number;  // أقل مدة ظهور لللودنج بالميلي ثانية
}

export default function FancyMenuLoading({ visible, onExited, minimumDuration = 1000 }: Props) {
    const [show, setShow] = useState(visible);
    const [startTime, setStartTime] = useState<number | null>(null);
    const progress = useSpring(0, { stiffness: 50, damping: 25 });

    useEffect(() => {
        if (!visible) return;

        setShow(true);
        setStartTime(Date.now());

        const interval = setInterval(() => {
            if (startTime === null) return;
            const elapsed = Date.now() - startTime;
            const nextProgress = Math.min((elapsed / minimumDuration) * 100, 100);
            progress.set(nextProgress);
        }, 50);

        return () => clearInterval(interval);
    }, [visible, minimumDuration, progress, startTime]);

    useEffect(() => {
        if (!visible) {
            if (!startTime) {
                setShow(false);
                if (onExited) onExited();
                return;
            }

            const elapsed = Date.now() - startTime;
            const remaining = Math.max(minimumDuration - elapsed, 0);

            const timer = setTimeout(() => {
                setShow(false);
                progress.set(100);
                if (onExited) onExited();
            }, remaining);

            return () => clearTimeout(timer);
        }
    }, [visible, startTime, minimumDuration, onExited, progress]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="fancy-menu-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8 } }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-white to-gray-100 overflow-hidden"
                >
                    {/* Background Glow */}
                    <motion.div
                        className="absolute inset-0 bg-primary/10 blur-3xl"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Logo & Rings */}
                    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                        <motion.div
                            className="absolute w-52 h-52 border-2 border-primary/20 rounded-full"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute w-44 h-44 border-2 border-primary/30 rounded-full"
                            animate={{ rotate: [360, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />

                        <motion.div
                            className="w-36 h-36 rounded-full bg-white/70 backdrop-blur-lg border border-primary/30 shadow-xl flex items-center justify-center p-4"
                            animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, 4, -4, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <img src="/logo.png" alt="Logo" className="w-28 h-28 object-contain" />
                        </motion.div>
                    </div>

                    {/* Loading Dots */}
                    <motion.div className="flex gap-3 mb-4 mt-16">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="w-4 h-4 rounded-full bg-linear-to-br from-blue-400 to-indigo-500"
                                animate={{ y: [0, -12, 0], scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </motion.div>

                    {/* Loading Text */}
                    <motion.span
                        className="text-primary font-extrabold text-lg text-center tracking-wider"
                        style={{ textShadow: "0 0 12px rgba(59,130,246,0.4)" }}
                        animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                    >
                        جاري التحميل ...
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}