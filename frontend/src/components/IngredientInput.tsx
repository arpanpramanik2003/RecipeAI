import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

const tagColors = [
  'hsl(330 80% 60%)',
  'hsl(270 70% 60%)',
  'hsl(15 90% 60%)',
  'hsl(40 95% 55%)',
  'hsl(160 50% 45%)',
  'hsl(200 70% 50%)',
];

const IngredientInput = ({ ingredients, onChange }: IngredientInputProps) => {
  const [value, setValue] = useState('');

  const addIngredient = () => {
    const trimmed = value.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
    if (e.key === 'Backspace' && value === '' && ingredients.length > 0) {
      onChange(ingredients.slice(0, -1));
    }
  };

  const remove = (idx: number) => onChange(ingredients.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground tracking-wide">Ingredients</label>
      <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-muted/20 border-2 border-border/80 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all duration-300 min-h-[56px] focus-within:shadow-[0_0_30px_hsl(330_80%_60%_/_0.15)] backdrop-blur-md">
        <AnimatePresence mode="popLayout">
          {ingredients.map((ing, i) => (
            <motion.span
              key={ing}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-primary-foreground cursor-default"
              style={{ backgroundColor: tagColors[i % tagColors.length] }}
            >
              {ing}
              <button
                onClick={() => remove(i)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <div className="flex items-center gap-1 flex-1 min-w-[140px]">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ingredients.length === 0 ? 'Add ingredients (e.g., Tomato, Chicken, Garlic)' : 'Add more...'}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          {value.trim() && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={addIngredient}
              className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-primary-foreground" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;
