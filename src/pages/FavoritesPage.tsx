import React from 'react';
import { usePromptStore } from '../store/promptStore';
import PromptList from '../components/prompts/PromptList';
import { SortOption, ViewMode } from '../types';

const FavoritesPage: React.FC = () => {
  const { 
    getFavoritePrompts, 
    toggleFavorite, 
    toggleVisibility,
    sortOption,
    viewMode,
    setSortOption,
    setViewMode
  } = usePromptStore();
  
  const favoritePrompts = getFavoritePrompts();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorite Prompts</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Your collection of favorite prompts for quick access
        </p>
      </div>
      
      {favoritePrompts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No favorite prompts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Mark prompts as favorites to see them here
          </p>
        </div>
      ) : (
        <PromptList
          prompts={favoritePrompts}
          viewMode={viewMode}
          sortOption={sortOption}
          onToggleFavorite={toggleFavorite}
          onToggleVisibility={toggleVisibility}
          onChangeViewMode={setViewMode}
          onChangeSortOption={setSortOption}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
