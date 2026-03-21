import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, BarChart3, Globe, RefreshCw, Bookmark, Share2, Check } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import HealthAnalysis from './HealthAnalysis';

interface Props {
  recipe: Recipe;
  onRegenerate: () => void;
}

const GeneratedRecipe = ({ recipe, onRegenerate }: Props) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const toggleCheck = (idx: number) => {
    const next = new Set(checkedItems);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCheckedItems(next);
  };

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="relative h-56 sm:h-72 overflow-hidden gradient-bg flex flex-col justify-end p-6 sm:p-8">
            <div className="absolute inset-0 bg-black/15 mix-blend-overlay pointer-events-none z-10" />
            
            {recipe.image && (
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 hover:scale-105" 
                crossOrigin="anonymous"
                loading="lazy"
              />
            )}
            
            <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
            
            <div className="relative z-20 w-full">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg pb-3">{recipe.title}</h2>
              <p className="text-white/95 text-sm sm:text-base font-medium drop-shadow-md leading-relaxed max-w-2xl">{recipe.description}</p>
            </div>
          </div>

          <div className="p-6 flex flex-wrap gap-4">
            {[
              { icon: <Clock className="w-4 h-4 text-primary" />, label: recipe.cookingTime },
              { icon: <BarChart3 className="w-4 h-4 text-primary" />, label: recipe.difficulty },
              { icon: <Globe className="w-4 h-4 text-primary" />, label: `${recipe.cuisineEmoji} ${recipe.cuisine}` },
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-muted/30 border border-border/50 text-sm font-bold tracking-wide text-foreground shadow-sm backdrop-blur-md"
              >
                {badge.icon} {badge.label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 sm:p-8 border-2 border-border/80 shadow-lg bg-gradient-to-br from-background/40 to-muted/20"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="p-2 gradient-bg rounded-lg text-white shadow-md">🥗</span> Ingredients
          </h3>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                onClick={() => toggleCheck(i)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left border ${
                  checkedItems.has(i) 
                  ? 'bg-primary/5 border-primary/30 shadow-inner' 
                  : 'bg-muted/20 border-transparent hover:bg-muted/40 hover:border-border/50'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  checkedItems.has(i) ? 'border-primary bg-primary shadow-[0_0_10px_hsl(330_80%_60%_/_0.4)]' : 'border-muted-foreground/30'
                }`}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: checkedItems.has(i) ? 1 : 0 }} className="flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                  </motion.div>
                </span>
                <span className={`flex-1 text-base transition-all duration-300 ${checkedItems.has(i) ? 'line-through text-muted-foreground opacity-60' : 'text-foreground font-medium'}`}>
                  {ing.name}
                </span>
                <span className={`text-sm font-bold transition-all duration-300 ${checkedItems.has(i) ? 'text-muted-foreground/40' : 'text-primary'}`}>{ing.quantity}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 sm:p-8 border-2 border-border/80 shadow-lg bg-gradient-to-br from-background/40 to-muted/20"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="p-2 gradient-bg rounded-lg text-white shadow-md">👨‍🍳</span> Steps
          </h3>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="group flex gap-5 p-5 rounded-2xl bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border/60 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform origin-top scale-y-0 group-hover:scale-y-100" />
                <span className="text-3xl flex-shrink-0 mt-1 drop-shadow-sm">{step.icon}</span>
                <div className="flex-1">
                  <span className="text-xs font-black text-primary/80 uppercase tracking-widest mb-1.5 block">Step {step.number}</span>
                  <p className="text-base text-foreground font-medium leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Health Analysis */}
        <HealthAnalysis recipe={recipe} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {[
            { icon: <RefreshCw className="w-4 h-4" />, label: 'Regenerate', onClick: onRegenerate, primary: true },
            { icon: <Bookmark className="w-4 h-4" />, label: 'Save', onClick: () => {}, primary: false },
            { icon: <Share2 className="w-4 h-4" />, label: 'Share', onClick: () => {}, primary: false },
          ].map((btn, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={btn.onClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                btn.primary
                  ? 'gradient-bg text-primary-foreground glow-primary'
                  : 'glass glass-hover text-foreground'
              }`}
            >
              {btn.icon} {btn.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GeneratedRecipe;
