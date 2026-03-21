import { useState } from 'react';
import Navbar from '@/components/Navbar';
import DishInput from '@/components/DishInput';
import ChatbotPanel from '@/components/ChatbotPanel';
import GeneratedRecipe from '@/components/GeneratedRecipe';
import LoadingState from '@/components/LoadingState';
import { Recipe } from '@/data/recipes';

const RecipeGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);

  const handleSearch = async (dishName: string) => {
    setIsLoading(true);
    setRecipeData(null);

    try {
      const response = await fetch("http://localhost:8000/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dish_name: dishName })
      });

      if (!response.ok) throw new Error("Failed to generate dish snippet");

      const generatedRecipe = await response.json();
      setRecipeData(generatedRecipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 max-w-[1400px] w-full mx-auto flex flex-col">
        {/* Header Area */}
        <div className="text-center mb-8 px-2 mt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Dish <span className="gradient-text">Generator</span> ✨
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 text-balance">
            Enter the name of any dish you're craving, and we'll provide a full recipe alongside your personal AI Sous-Chef.
          </p>
          <DishInput onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Content Layout - Two Columns on Large Screens */}
        <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
          
          {/* Left Column: Recipe Results */}
          <div className="flex-1 w-full xl:w-2/3 max-w-full">
             {isLoading && <LoadingState />}
             {!isLoading && !recipeData && (
               <div className="glass flex flex-col items-center justify-center p-12 min-h-[500px] text-center rounded-[2rem] border-2 border-dashed border-border mt-1">
                 <div className="text-6xl mb-6 bg-muted p-6 rounded-full inline-flex">🍽️</div>
                 <h3 className="text-2xl font-bold mb-3 text-foreground">Ready to Cook?</h3>
                 <p className="text-muted-foreground max-w-sm">
                   Type a dish name above. Your AI-generated recipe layout and health analysis will magically appear right here.
                 </p>
               </div>
             )}
             {!isLoading && recipeData && (
               <div className="-mt-16 sm:-mt-12 transition-all">
                 <GeneratedRecipe recipe={recipeData} onRegenerate={() => handleSearch(recipeData.title)} />
               </div>
             )}
          </div>

          {/* Right Column: AI Chatbot */}
          <div className="w-full xl:w-[400px] flex-shrink-0 xl:sticky xl:top-[120px] mb-8 xl:mb-0">
             <ChatbotPanel currentRecipe={recipeData} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default RecipeGenerator;
