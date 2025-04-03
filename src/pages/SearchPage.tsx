import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { usePromptStore } from '../store/promptStore';
import PromptList from '../components/prompts/PromptList';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const { 
    prompts, 
    toggleFavorite, 
    toggleVisibility,
    sortOption,
    viewMode,
    setSortOption,
    setViewMode
  } = usePromptStore();
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<typeof prompts>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  // Extract all unique tags from prompts
  const allTags = Array.from(
    new Set(prompts.flatMap(prompt => prompt.tags))
  );
  
  useEffect(() => {
    // Update search results when query or active tags change
    let filtered = prompts;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        prompt => 
          prompt.title.toLowerCase().includes(query) || 
          prompt.content.toLowerCase().includes(query)
      );
    }
    
    if (activeTags.length > 0) {
      filtered = filtered.filter(
        prompt => activeTags.some(tag => prompt.tags.includes(tag))
      );
    }
    
    setSearchResults(filtered);
  }, [prompts, searchQuery, activeTags]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search Prompts</h1>
        
        <form onSubmit={handleSearch} className="flex w-full max-w-lg">
          <Input
            type="text"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-r-none"
          />
          <Button
            type="submit"
            className="rounded-l-none"
          >
            <SearchIcon size={16} className="mr-1" /> Search
          </Button>
        </form>
      </div>
      
      {allTags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by tags:
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTags.includes(tag) ? 'primary' : 'default'}
                onClick={() => toggleTag(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {searchQuery || activeTags.length > 0
            ? `Search Results (${searchResults.length})`
            : 'All Prompts'}
        </h2>
        
        {searchResults.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try different search terms or filters
            </p>
          </div>
        ) : (
          <PromptList
            prompts={searchResults}
            viewMode={viewMode}
            sortOption={sortOption}
            onToggleFavorite={toggleFavorite}
            onToggleVisibility={toggleVisibility}
            onChangeViewMode={setViewMode}
            onChangeSortOption={setSortOption}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
