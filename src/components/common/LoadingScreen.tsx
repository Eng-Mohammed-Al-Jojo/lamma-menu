import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
    visible: boolean;
    onExited?: () => void;
    duration?: number;
}

export default function FancyFixedLoading({
    visible,
    onExited,
    duration = 2000,
}: Props) {
    const [show, setShow] = useState(visible);
    const progress = useSpring(0, { stiffness: 60, damping: 20 });
    const startTimeRef = useRef<number | null>(null);
    const exitCalledRef = useRef(false);

    // ── Scroll lock ──────────────────────────────────────────────
    useEffect(() => {
        if (!show) return;
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflowY = "scroll";
        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflowY = "";
            window.scrollTo(0, scrollY);
        };
    }, [show]);

    // ── Helper: complete and exit ────────────────────────────────
    const triggerExit = useRef<() => void>(() => { });
    triggerExit.current = () => {
        if (exitCalledRef.current) return;
        exitCalledRef.current = true;
        progress.set(100);
        setTimeout(() => {
            setShow(false);
            onExited?.();
        }, 250);
    };

    // ── On mount: start progress fill ───────────────────────────
    useEffect(() => {
        if (!visible) return;

        setShow(true);
        exitCalledRef.current = false;
        progress.set(0);
        startTimeRef.current = Date.now();

        // Fill to 85% over duration as a visual indicator only
        const interval = setInterval(() => {
            const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
            const next = Math.min((elapsed / duration) * 85, 85);
            progress.set(next);
        }, 50);

        // Safety timeout — exits even if visible never flips false
        const safetyTimer = setTimeout(() => {
            clearInterval(interval);
            triggerExit.current();
        }, duration * 3); // 3× duration as a last resort

        return () => {
            clearInterval(interval);
            clearTimeout(safetyTimer);
        };
    }, [visible]);

    // ── React to visible=false (data loaded) ─────────────────────
    // This is the MAIN exit trigger — fires when Menu calls onLoadingChange(false)
    useEffect(() => {
        if (visible) return;
        if (!show) return;

        const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
        const remaining = Math.max(duration - elapsed, 0);

        // Wait out the minimum duration, then exit
        const timer = setTimeout(() => {
            triggerExit.current();
        }, remaining);

        return () => clearTimeout(timer);
    }, [visible]);

    const barWidth = useTransform(progress, (v) => `${v}%`);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="fancy-fixed-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden"
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(circle at center, rgba(29,62,153,0.05) 0%, transparent 65%)" }}
                    />

                    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                        <motion.div
                            className="absolute w-52 h-52 border border-primary/15 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute w-44 h-44 border border-primary/25 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <svg
                            className="absolute inset-0 w-40 h-40"
                            style={{ transform: "rotate(-90deg)" }}
                            viewBox="0 0 160 160"
                        >
                            <circle cx="80" cy="80" r="72"
                                stroke="rgba(29,62,153,0.07)"
                                strokeWidth="1.5" fill="none"
                            />
                            <motion.circle
                                cx="80" cy="80" r="72"
                                stroke="var(--color-primary)"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 72 * 0.22} ${2 * Math.PI * 72 * 0.78}`}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                style={{ transformOrigin: "80px 80px" }}
                            />
                        </svg>
                        <motion.div
                            className="w-28 h-28 rounded-full bg-gray-50 border border-primary/10 flex items-center justify-center p-4 z-10"
                            animate={{ scale: [0.97, 1.03, 0.97] }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </motion.div>
                    </div>

                    <div className="flex gap-2 mt-8">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="w-3 h-3 rounded-full bg-primary/40"
                                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }}
                            />
                        ))}
                    </div>

                    <motion.span
                        className="mt-8 text-primary/70 font-bold text-base tracking-wide"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                    >
                        جاري التحميل ...
                    </motion.span>

                    <div className="mt-5 w-36 h-[2px] bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            style={{ width: barWidth }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}