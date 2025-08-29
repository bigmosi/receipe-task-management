import React, { useState, useEffect } from "react";
import {
  Search,
  Heart,
  Clock,
  Users,
  ExternalLink,
  Loader2,
  Star,
} from "lucide-react";

const SPOONACULAR_API_KEY = "0a8a7d69cb0e4bc4863f1cd24b262655";
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  sourceUrl: string;
}

interface RecipeSearchProps {
  favoriteRecipes: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({
  favoriteRecipes,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "favorites">("search");

  const searchRecipes = async (term: string) => {
    setLoading(true);

    try {
      let url;
      if (term.trim()) {
        // Search for specific recipes
        url = `${SPOONACULAR_BASE_URL}/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(
          term
        )}&number=12&addRecipeInformation=true&fillIngredients=true`;
      } else {
        // Get random popular recipes
        url = `${SPOONACULAR_BASE_URL}/random?apiKey=${SPOONACULAR_API_KEY}&number=24`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response structures
      let recipesData;
      if (term.trim()) {
        recipesData = data.results || [];
      } else {
        recipesData = data.recipes || [];
      }

      const transformedRecipes: Recipe[] = recipesData.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        summary: recipe.summary,
        sourceUrl: recipe.sourceUrl || recipe.spoonacularSourceUrl || "#",
      }));

      setRecipes(transformedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      // Fallback to empty array on error
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchRecipes("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRecipes(searchTerm);
  };

  const isFavorite = (recipe: Recipe) => {
    return favoriteRecipes.some((fav) => fav.id === recipe.id);
  };

  const stripHtml = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-2 md:px-0 bg-gradient-to-br from-orange-50 via-yellow-100 to-pink-100 min-h-screen pb-12">
      <div className="pt-8">
        <h2 className="text-3xl font-extrabold text-pink-700 mb-2 drop-shadow">
          Recipe Discovery
        </h2>
        <p className="text-pink-500">Find and save your favorite recipes</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-pink-100/60 p-1 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "search"
              ? "bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-200 text-white shadow-md"
              : "text-pink-600 hover:text-pink-900"
          }`}
        >
          Discover Recipes
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "favorites"
              ? "bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-200 text-white shadow-md"
              : "text-pink-600 hover:text-pink-900"
          }`}
        >
          Favorites ({favoriteRecipes.length})
        </button>
      </div>

      {activeTab === "search" && (
        <>
          <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-md border border-pink-100 p-4 md:p-6">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="h-5 w-5 text-pink-300 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search for recipes... (e.g., chicken, pasta, salad)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/80 text-pink-700 placeholder-pink-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-yellow-400 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">
                Searching for delicious recipes...
              </span>
            </div>
          )}

          {/* Recipes Grid */}
          {!loading && recipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col cursor-pointer group"
                  onClick={() => setSelectedRecipe(recipe)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedRecipe(recipe);
                  }}
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-44 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110 group-focus:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-colors ${
                        isFavorite(recipe)
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-white text-gray-400 hover:text-red-600 hover:bg-red-50"
                      }`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter" || e.key === " ")
                          onToggleFavorite(recipe);
                      }}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite(recipe) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-pink-900 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-pink-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>

                    <p className="text-pink-500 text-sm mb-4 line-clamp-3">
                      {stripHtml(recipe.summary)}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-pink-600 font-medium text-sm opacity-70 group-hover:underline">
                        View Details
                      </span>
                      <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-orange-400 hover:text-orange-600 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Recipe Source
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results (always show if not loading and no recipes) */}
          {!loading && recipes.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recipes found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try searching with different keywords or check your internet connection"
                  : "No recipes available at the moment. Please try again later."}
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === "favorites" && (
        <div>
          {favoriteRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-gradient-to-br from-yellow-50 via-pink-50 to-orange-50 rounded-xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-44 sm:h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-red-100 text-red-600 p-2 rounded-full shadow-lg">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-orange-700 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-orange-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>

                    <p className="text-orange-400 text-sm mb-4 line-clamp-3">
                      {stripHtml(recipe.summary)}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <button
                        onClick={() => setSelectedRecipe(recipe)}
                        className="text-orange-500 hover:text-orange-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onToggleFavorite(recipe)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-lg border border-pink-100 p-12 text-center">
              <Heart className="h-12 w-12 text-pink-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-pink-700 mb-2">
                No favorite recipes yet
              </h3>
              <p className="text-pink-400 mb-6">
                Start exploring recipes and add some to your favorites
              </p>
              <button
                onClick={() => setActiveTab("search")}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-lg hover:from-pink-500 hover:to-yellow-400 transition-colors"
              >
                Discover Recipes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-48 sm:h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white text-pink-400 p-2 rounded-full shadow-lg hover:text-pink-700"
              >
                ✕
              </button>
              <button
                onClick={() => onToggleFavorite(selectedRecipe)}
                className={`absolute top-4 left-4 p-2 rounded-full shadow-lg transition-colors ${
                  isFavorite(selectedRecipe)
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-white text-gray-400 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite(selectedRecipe) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <h2 className="text-2xl font-bold text-pink-700 mb-4">
                {selectedRecipe.title}
              </h2>

              <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-pink-500">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{selectedRecipe.readyInMinutes} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{selectedRecipe.servings} servings</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pink-700 mb-3">
                  About this recipe
                </h3>
                <p className="text-pink-500 leading-relaxed">
                  {stripHtml(selectedRecipe.summary)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <a
                  href={selectedRecipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white rounded-lg hover:from-pink-500 hover:to-yellow-400 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Recipe
                </a>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-4 py-2 text-pink-400 hover:text-pink-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
