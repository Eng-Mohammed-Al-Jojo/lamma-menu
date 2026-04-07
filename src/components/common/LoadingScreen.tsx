import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    visible: boolean;
    onExited?: () => void;
}

export default function LoadingScreen({ visible, onExited }: Props) {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === "ar";

    const [targetProgress, setTargetProgress] = useState(0);
    const [msgIndex, setMsgIndex] = useState(0);

    const progress = useSpring(0, {
        stiffness: 40,
        damping: 20,
        mass: 1.5,
    });

    useEffect(() => {
        progress.set(targetProgress);
    }, [targetProgress, progress]);

    useEffect(() => {
        if (!visible) {
            setTargetProgress(100);
            return;
        }

        const interval = setInterval(() => {
            setTargetProgress((prev) => {
                if (prev >= 90) return prev;
                const dist = 90 - prev;
                return prev + dist * 0.08 + Math.random() * 0.4;
            });
        }, 180);

        return () => clearInterval(interval);
    }, [visible]);

    const messages = useMemo(() => isRtl
        ? ["نسعى لخدمتكم ...", "نستخدم أجود المكونات...", "لمتنا للعيلة تفرح ...", "مرحباً بك"]
        : ["We strive to serve you...", "The finest ingredients...", "Spicing up moments...", "Welcome"], [isRtl]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2200);
        return () => clearInterval(interval);
    }, [messages.length]);

    const radius = 120;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset = useTransform(progress, [0, 100], [circumference, 0]);
    const roundedProgress = useTransform(progress, p => `${Math.round(p)}%`);

    return (
        <AnimatePresence onExitComplete={onExited}>
            {visible && (
                <motion.div
                    key="loading-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.05,
                        filter: "blur(20px)",
                        transition: { duration: 1, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden bg-white select-none"
                    dir={isRtl ? "rtl" : "ltr"}
                >

                    {/* Layer 1: Background */}
                    <div className="absolute inset-0 z-0 scale-105">
                        <motion.div
                            initial={{ scale: 1.15, filter: "brightness(0.5) blur(12px)" }}
                            animate={{ scale: 1, filter: "brightness(0.65) blur(4px)" }}
                            transition={{ duration: 10, ease: "easeOut" }}
                            className="absolute inset-0 bg-cover bg-center pointer-events-none"
                            style={{ backgroundImage: "url('/logo.png')" }}
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/20 to-white/60" />
                        <div
                            className="absolute inset-0 opacity-30 mix-blend-overlay"
                            style={{ background: `radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)` }}
                        />
                    </div>

                    {/* Layer 2: Light Effects */}
                    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen overflow-hidden opacity-25">
                        <motion.div
                            animate={{ x: ['-80%', '180%'], opacity: [0, 0.3, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[30%] w-[120vw] h-[40vh] bg-primary/60 blur-[120px] -rotate-12"
                        />
                        <motion.div
                            animate={{ x: ['180%', '-80%'], opacity: [0, 0.25, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                            className="absolute bottom-[30%] w-screen h-[30vh] bg-primary/20 blur-[100px] rotate-6"
                        />
                    </div>

                    {/* Center */}
                    <div className="relative z-10 w-[300px] h-[300px] flex items-center justify-center">

                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(59,130,246,0.25)]" viewBox="0 0 280 280">
                            <defs>
                                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--color-primary)" />
                                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.6" />
                                </linearGradient>
                            </defs>

                            <circle cx="140" cy="140" r={radius} stroke="rgba(0,0,0,0.05)" strokeWidth="1" fill="none" />

                            <motion.circle
                                cx="140" cy="140" r={radius}
                                stroke="url(#ringGradient)"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset
                                }}
                            />

                            <motion.circle
                                cx="140" cy="140" r={radius - 8}
                                stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="4 20"
                                fill="none" className="opacity-20"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                style={{ originX: '140px', originY: '140px' }}
                            />
                        </svg>

                        {/* Glass Orb */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        >
                            <motion.div
                                animate={{ y: [-6, 6, -6] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="relative w-44 h-44 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.08),0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center p-8 overflow-hidden"
                            >
                                <motion.div
                                    animate={{ x: ['-150%', '250%'] }}
                                    transition={{ duration: 3.5, repeat: Infinity }}
                                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                />

                                <motion.img
                                    src="/logo.png"
                                    className="w-full h-full object-contain relative z-10"
                                    alt="Logo"
                                    animate={{ scale: [0.98, 1.02, 0.98] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Text */}
                    <div className="relative z-10 mt-10 flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={msgIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.8 }}
                                className="text-xl md:text-2xl font-black text-primary/90 text-center tracking-widest uppercase"
                            >
                                {messages[msgIndex]}
                            </motion.h2>
                        </AnimatePresence>

                        <div className="mt-6 flex items-center gap-6">
                            <div className="h-1 w-20 bg-linear-to-r from-transparent via-primary/20 to-primary" />
                            <motion.span className="text-lg font-black text-primary tracking-widest w-12 text-center">
                                {roundedProgress}
                            </motion.span>
                            <div className="h-1 w-20 bg-linear-to-l from-transparent via-primary/20 to-primary" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}