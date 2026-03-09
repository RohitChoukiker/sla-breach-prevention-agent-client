import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 skeleton-loading" />
          <div className="h-8 w-16 skeleton-loading" />
          <div className="h-3 w-20 skeleton-loading" />
        </div>
        <div className="h-12 w-12 rounded-xl skeleton-loading" />
      </div>
    </motion.div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border p-4">
        <div className="flex gap-4">
          {[100, 150, 80, 60, 80, 100].map((w, i) => (
            <div key={i} className="skeleton-loading h-4" style={{ width: w }} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border p-4 last:border-0">
          <div className="flex gap-4">
            {[100, 150, 80, 60, 80, 100].map((w, j) => (
              <div key={j} className="skeleton-loading h-4" style={{ width: w }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
