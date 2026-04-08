import { motion } from "framer-motion";

export default function SectionSkeleton() {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Category Header Skeleton (Placeholder for title) */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="h-8 w-48 bg-(--text-muted)/20 rounded-full animate-pulse" />
        <div className="h-4 w-32 bg-(--text-muted)/10 rounded-full animate-pulse" />
      </div>

      {/* Items Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="relative flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-(--bg-card)/40 rounded-4xl border border-(--border-color) overflow-hidden"
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent z-10"
              animate={{ translateX: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, delay: item * 0.1, ease: "easeInOut" }}
            />

            <div className="flex-1 flex flex-col gap-3 justify-center">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-3/4 bg-(--text-muted)/20 rounded-full" />
                  <div className="h-3 w-full bg-(--text-muted)/10 rounded-full" />
                  <div className="h-3 w-2/3 bg-(--text-muted)/10 rounded-full" />
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="h-5 w-16 bg-(--text-muted)/20 rounded-full" />
                  <div className="w-8 h-8 rounded-xl bg-(--text-muted)/10 mt-2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
