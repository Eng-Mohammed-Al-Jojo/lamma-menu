import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend, FiMessageSquare, FiCheckCircle, FiStar, FiUser, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    complaintsWhatsapp: string;
}

export default function FeedbackModal({ isOpen, onClose, complaintsWhatsapp }: Props) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [rating, setRating] = useState(0); // 1-5
    const [message, setMessage] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setName("");
            setPhone("");
            setRating(0);
            setMessage("");
            setShowSuccess(false);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const isValid = rating > 0 && message.trim().length > 0;

    const handleSend = () => {
        if (!isValid) return;
        setIsSubmitting(true);

        const structuredMessage = `📩 Feedback جديد\n\n👤 الاسم: ${name.trim() || (isRtl ? "غير محدد" : "Not specified")}\n📞 الرقم: ${phone.trim() || (isRtl ? "غير محدد" : "Not specified")}\n\n⭐ التقييم: ${rating}/5\n\n📝 الملاحظات:\n${message.trim()}`;
        const encodedMessage = encodeURIComponent(structuredMessage);
        window.open(`https://wa.me/${complaintsWhatsapp}?text=${encodedMessage}`, "_blank");

        setShowSuccess(true);
        setTimeout(() => {
            onClose();
        }, 2200);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    id="feedback-overlay"
                    className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-white rounded-4xl shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center z-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            <FiX size={20} />
                        </button>

                        <AnimatePresence mode="wait">
                            {!showSuccess ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="w-full flex flex-col items-center"
                                >
                                    {/* Icon & Title */}
                                    <div className="mb-4 p-4 bg-primary/5 rounded-2xl text-primary">
                                        <FiMessageSquare size={24} />
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-primary mb-2">
                                        {t('common.feedback')}
                                    </h2>

                                    <p className="text-sm text-gray-500 font-medium mb-8">
                                        {isRtl
                                            ? "رأيك يطوّر خدمتنا! شاركنا تجربتك بكل صراحة."
                                            : "Your feedback improves our service! Share your experience."}
                                    </p>

                                    {/* Rating Section */}
                                    <div className="flex flex-col items-center gap-2 mb-8">

                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <motion.button
                                                    key={star}
                                                    whileHover={{ scale: 1.15 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setRating(star)}
                                                    className={`w-10 h-10 flex items-center justify-center text-4xl transition-colors ${rating >= star ? 'text-amber-400' : 'text-gray-200 hover:text-amber-200'}`}
                                                >
                                                    <FiStar fill={rating >= star ? "currentColor" : "none"} strokeWidth={2} />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-3">
                                        <div className="relative">
                                            <FiUser className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-300`} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder={isRtl ? "الاسم" : "Name"}
                                                className={`w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm font-bold outline-none focus:border-primary/20 focus:bg-white transition-all`}
                                            />
                                        </div>
                                        <div className="relative">
                                            <FiPhone className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-300`} />
                                            <input
                                                type="tel"
                                                dir="ltr"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder={isRtl ? "رقم الهاتف" : "Phone"}
                                                className={`w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4'} text-sm font-bold outline-none focus:border-primary/20 focus:bg-white transition-all`}
                                            />
                                        </div>
                                    </div>

                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={isRtl ? "اكتب ملاحظاتك هنا..." : "Write your feedback here..."}
                                        className="w-full h-28 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary/20 focus:bg-white transition-all resize-none mb-6"
                                    />

                                    {/* Action */}
                                    <button
                                        onClick={handleSend}
                                        disabled={!isValid || isSubmitting}
                                        className="w-full py-2 bg-primary text-white rounded-xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <span>{t('common.send')}</span>
                                        <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center py-10"
                                >
                                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                                        <FiCheckCircle size={40} />
                                    </div>
                                    <h2 className="text-2xl font-black text-primary mb-2">
                                        {isRtl ? "تم الإرسال بنجاح!" : "Sent Successfully!"}
                                    </h2>
                                    <p className="text-gray-500 font-bold">
                                        {isRtl ? "شكراً لملاحظاتك القيمة." : "Thank you for your feedback."}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <span className="mt-6 text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] opacity-50">
                            {isRtl ? "عبر واتسـاب" : "via WhatsApp"}
                        </span>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
