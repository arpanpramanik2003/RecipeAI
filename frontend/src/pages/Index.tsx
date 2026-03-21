import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SuggestedRecipes from '@/components/SuggestedRecipes';
import GeneratedRecipe from '@/components/GeneratedRecipe';
import LoadingState from '@/components/LoadingState';
import { Recipe, suggestedRecipes } from '@/data/recipes';
import { useNavigate } from 'react-router-dom';

interface QueryData {
  ingredients?: string[];
  servings?: number;
  cuisine?: string;
  dish_name?: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [currentQuery, setCurrentQuery] = useState<QueryData | null>(null);

  const handleGenerate = useCallback(async (data: QueryData) => {
    setCurrentQuery(data);
    setIsLoading(true);
    setShowRecipe(false);

    try {
      const payload: any = {};
      if (data.ingredients) payload.ingredients = data.ingredients;
      if (data.servings) payload.servings = data.servings;
      if (data.cuisine) payload.cuisine = data.cuisine;
      if (data.dish_name) payload.dish_name = data.dish_name;

      const response = await fetch("http://localhost:8000/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const generatedRecipe = await response.json();
      setRecipeData(generatedRecipe);
      setShowRecipe(true);
    } catch (error) {
      console.error("Error generating recipe:", error);
      // Optionally show a toast error here
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (currentQuery) {
      handleGenerate(currentQuery);
    }
  }, [currentQuery, handleGenerate]);

  const navigate = useNavigate();

  const handleSelectRecipe = useCallback((id: string) => {
    const suggested = suggestedRecipes.find(r => r.id === id);
    if (suggested) {
      // Direct them to the Generator page or generate locally
      handleGenerate({ dish_name: suggested.title, servings: suggested.servings, cuisine: suggested.cuisine });
      
      // Smooth scroll to the result
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [handleGenerate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onGenerate={handleGenerate} isLoading={isLoading} />
      <SuggestedRecipes onSelectRecipe={handleSelectRecipe} />
      {isLoading && <LoadingState />}
      {showRecipe && !isLoading && recipeData && (
        <GeneratedRecipe recipe={recipeData} onRegenerate={handleRegenerate} />
      )}
    </div>
  );
};

export default Index;
