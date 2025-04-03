import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePromptStore } from '../store/promptStore';
import { SortOption, ViewMode } from '../types';
import PromptList from '../components/prompts/PromptList';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    prompts, 
    sortOption, 
    viewMode, 
    searchQuery,
    activeTag,
    activeCollection,
    toggleFavorite, 
    toggleVisibility,
    setSortOption,
    setViewMode,
  } = usePromptStore();

  const [filteredPrompts, setFilteredPrompts] = useState(prompts);

  useEffect(() => {
    let filtered = [...prompts];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        prompt => 
          prompt.title.toLowerCase().includes(query) || 
          prompt.content.toLowerCase().includes(query) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply tag filter
    if (activeTag) {
      filtered = filtered.filter(
        prompt => prompt.tags.includes(activeTag)
      );
    }
    
    // Apply collection filter
    if (activeCollection) {
      filtered = filtered.filter(
        prompt => prompt.collectionId === activeCollection
      );
    }
    
    setFilteredPrompts(filtered);
  }, [prompts, searchQuery, activeTag, activeCollection]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Prompts</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/prompts/new')}
          className="flex items-center"
        >
          <Plus size={16} className="mr-1" /> New Prompt
        </Button>
      </div>
      
      <PromptList
        prompts={filteredPrompts}
        viewMode={viewMode}
        sortOption={sortOption}
        onToggleFavorite={toggleFavorite}
        onToggleVisibility={toggleVisibility}
        onChangeViewMode={setViewMode}
        onChangeSortOption={setSortOption}
      />
    </div>
  );
};

export default HomePage;
