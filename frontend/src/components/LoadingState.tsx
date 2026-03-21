import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <section className="py-4 w-full">
      <div className="space-y-6">
        {/* AI indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-xl border-2 border-border/50 bg-gradient-to-br from-background/60 to-muted/30 backdrop-blur-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-6 drop-shadow-2xl"
          >
            🍳
          </motion.div>
          <h3 className="text-3xl font-black tracking-tight mb-3 text-foreground">
            Cooking your <span className="gradient-text">recipe...</span>
          </h3>
          <p className="text-muted-foreground font-medium mb-8 text-lg animate-pulse">
            Our AI Chef is preparing the finest ingredients
          </p>
          <div className="flex items-center justify-center gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 shadow-[0_0_15px_hsl(330_80%_60%_/_0.6)]"
              />
            ))}
          </div>
        </motion.div>

        {/* Skeleton cards */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl overflow-hidden border border-border/60"
          >
            {i === 1 && <div className="h-48 sm:h-64 shimmer opacity-50" />}
            <div className="p-8 space-y-5">
              <div className="h-8 w-1/3 rounded-xl shimmer opacity-50" />
              <div className="space-y-3">
                <div className="h-5 w-full rounded-lg shimmer opacity-40" />
                <div className="h-5 w-5/6 rounded-lg shimmer opacity-40" />
                <div className="h-5 w-4/6 rounded-lg shimmer opacity-40" />
              </div>
              {i === 1 && (
                <div className="flex gap-3 pt-4">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-10 w-28 rounded-full shimmer opacity-60" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LoadingState;
