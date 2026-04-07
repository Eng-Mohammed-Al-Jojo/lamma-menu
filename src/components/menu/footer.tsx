import {
  FaLaptopCode,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaPhoneAlt,
  FaTelegramPlane,
  FaTiktok,
  FaCommentDots,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

const LOCAL_STORAGE_KEY = "footerInfo";

interface FooterProps {
  onOpenFeedback?: () => void;
  complaintsWhatsapp?: string;
}

export default function Footer({ onOpenFeedback, complaintsWhatsapp }: FooterProps) {
  const [footer, setFooter] = useState({
    address: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    telegram: "",
  });

  useEffect(() => {
    /* ===== footerInfo ===== */
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) setFooter(JSON.parse(localData));

    const footerRef = ref(db, "settings/footerInfo");
    const unsubFooter = onValue(footerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFooter(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
    });

    return () => unsubFooter();
  }, []);

  /* ===== Social Icons ===== */
  const socialIcons: { Icon: any; url: string | undefined }[] = [
    {
      Icon: FaWhatsapp,
      url: footer.whatsapp ? `https://wa.me/${footer.whatsapp}` : undefined,
    },
    { Icon: FaInstagram, url: footer.instagram || undefined },
    { Icon: FaFacebookF, url: footer.facebook || undefined },
    { Icon: FaTiktok, url: footer.tiktok || undefined },
    { Icon: FaTelegramPlane, url: footer.telegram || undefined },
  ];

  return (
    <footer className="w-full bg-(--bg-card)/40 backdrop-blur-md border-t border-(--border-color) py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        {/* Contact info Row */}
        <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-(--text-main)">
          {footer.address && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              <span>{footer.address}</span>
            </div>
          )}
          {footer.phone && (
            <a href={`tel:${footer.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <FaPhoneAlt className="text-primary" />
              <span>{footer.phone}</span>
            </a>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {socialIcons.map(({ Icon, url }, i) => url && (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-(--bg-main) border border-(--border-color) text-(--text-main) hover:border-primary hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md">
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Feedback Button */}
        {complaintsWhatsapp && complaintsWhatsapp !== "" && (
          <button
            onClick={onOpenFeedback}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25"
          >
            <FaCommentDots size={20} />
            <span className="text-lg">شاركنا برأيك</span>
          </button>
        )}

        {/* Developer Signature */}
        <div className="pt-8 border-t border-(--border-color) w-full flex flex-col items-center gap-4">
          <a href="https://engmohammedaljojo.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <FaLaptopCode className="text-lg" />
            <div className="text-[10px] font-black uppercase tracking-widest text-center">
              تصميم وتطوير: المهندس محمد الجوجو
            </div>
          </a>
          <p className="text-[10px] text-(--text-muted) font-bold">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
