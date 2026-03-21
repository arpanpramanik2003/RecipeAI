import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, Users } from 'lucide-react';
import IngredientInput from './IngredientInput';
import { cuisines } from '@/data/recipes';

interface HeroSectionProps {
  onGenerate: (data: { ingredients: string[], servings: number, cuisine: string }) => void;
  isLoading: boolean;
}

const HeroSection = ({ onGenerate, isLoading }: HeroSectionProps) => {
  const [ingredients, setIngredients] = useState<string[]>(['Chicken', 'Tomato', 'Garlic']);
  const [servings, setServings] = useState(4);
  const [cuisine, setCuisine] = useState('indian');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCuisine = cuisines.find(c => c.value === cuisine)!;

  return (
    <section className="relative pt-32 pb-20 px-6">
      {/* Aura background */}
      <div className="absolute inset-0 bg-aura pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance">
            Create Your Perfect
            <br />
            <span className="gradient-text">Recipe</span> 🍳
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
            Tell us what you have, and our AI will craft the ideal dish for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 sm:p-8 animate-float"
          style={{ animationDuration: '6s' }}
        >
          <div className="space-y-6">
            <IngredientInput ingredients={ingredients} onChange={setIngredients} />

            {/* Servings slider */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2 tracking-wide">
                <Users className="w-4 h-4 text-primary" />
                Servings
              </label>
              <div className="flex items-center gap-5 bg-muted/20 p-2.5 rounded-3xl border-2 border-border/80 backdrop-blur-md transition-all focus-within:border-primary/40 focus-within:shadow-[0_0_20px_hsl(330_80%_60%_/_0.1)]">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-muted-foreground/20 cursor-pointer accent-primary [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all duration-200 ml-2"
                />
                <motion.div 
                  key={servings}
                  initial={{ scale: 0.8, y: -10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  className="bg-gradient-to-br from-purple-500 to-orange-500 text-white shadow-[0_4px_20px_hsl(330_80%_60%_/_0.4)] text-base font-black w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                >
                  {servings}
                </motion.div>
              </div>
            </div>

            {/* Cuisine dropdown */}
            <div className="space-y-3 relative pt-2">
              <label className="text-sm font-semibold tracking-wide text-foreground">Cuisine</label>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/20 border-2 border-border/80 hover:border-primary/40 focus:border-primary/50 focus:shadow-[0_0_20px_hsl(330_80%_60%_/_0.15)] transition-all duration-300 text-base font-medium backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-background rounded-full p-1 shadow-sm">{selectedCuisine.emoji}</span>
                  <span>{selectedCuisine.label}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl p-2.5 z-20 shadow-xl border border-border/50 backdrop-blur-xl"
                >
                  {cuisines.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => { setCuisine(c.value); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                        cuisine === c.value ? 'bg-primary/10 text-primary font-bold shadow-inner' : 'hover:bg-muted/80 text-foreground font-medium'
                      }`}
                    >
                      <span className="text-xl">{c.emoji}</span> {c.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGenerate({ ingredients, servings, cuisine })}
              disabled={isLoading}
              className="mt-6 w-full py-4.5 min-h-[60px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 text-white font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_30px_hsl(330_80%_60%_/_0.4)] hover:shadow-[0_8px_40px_hsl(330_80%_60%_/_0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              {isLoading ? 'Cooking your recipe...' : 'Generate Recipe'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
