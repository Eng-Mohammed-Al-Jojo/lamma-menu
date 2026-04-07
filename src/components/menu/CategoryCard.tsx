import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { type Category } from "./Menu";

interface Props {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      className="w-full "
    >
      <button
        onClick={() => navigate(`/category/${category.id}`)}
        className="w-full group relative flex flex-col sm:flex-row items-center bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 border-3 border-gray-200 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary/30 outline-none"
      >
        {/* Image Section */}
        <div className="relative w-full sm:w-1/3 aspect-video sm:aspect-square overflow-hidden bg-gray-50">
          {category.image ? (
            <img
              src={`/images/${category.image}`}
              alt={category.nameAr || category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
                target.className = "w-1/2 h-1/2 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-10">
              <img src="/logo.png" className="w-1/2" alt="fallback" />
            </div>
          )}
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="w-full sm:w-2/3 p-6 sm:p-8 flex flex-col items-center sm:items-start text-center sm:text-right">
          <h3 className="text-xl sm:text-3xl font-black text-primary group-hover:translate-x-[-8px] transition-transform duration-300">
            {category.nameAr || category.name}
          </h3>
          <div className="mt-4 h-1.5 w-12 bg-primary/20 rounded-full group-hover:w-24 group-hover:bg-primary transition-all duration-500" />

          {/* Always Visible Browse Button */}
          <div className="mt-8 px-6 py-2.5 bg-primary text-white rounded-full flex items-center gap-3 shadow-lg shadow-primary/20 group-hover:bg-primary/90 transition-all duration-300">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest">
              {t('common.browse_menu')}
            </span>
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
