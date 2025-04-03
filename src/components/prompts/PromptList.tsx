import React from 'react';
import { Grid, List, SortAsc, SortDesc, Calendar } from 'lucide-react';
import { Prompt, SortOption, ViewMode } from '../../types';
import PromptCard from './PromptCard';
import Button from '../ui/Button';

interface PromptListProps {
  prompts: Prompt[];
  viewMode: ViewMode;
  sortOption: SortOption;
  onToggleFavorite?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onChangeViewMode: (mode: ViewMode) => void;
  onChangeSortOption: (option: SortOption) => void;
}

const PromptList: React.FC<PromptListProps> = ({
  prompts,
  viewMode,
  sortOption,
  onToggleFavorite,
  onToggleVisibility,
  onChangeViewMode,
  onChangeSortOption,
}) => {
  // Sort prompts based on the selected option
  const sortedPrompts = [...prompts].sort((a, b) => {
    switch (sortOption) {
      case SortOption.NEWEST:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case SortOption.OLDEST:
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case SortOption.ALPHABETICAL:
        return a.title.localeCompare(b.title);
      case SortOption.RECENTLY_UPDATED:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
        </div>
        
        <div className="flex space-x-2">
          <div className="flex border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <Button
              variant={sortOption === SortOption.NEWEST ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChangeSortOption(SortOption.NEWEST)}
              className="rounded-none border-0"
            >
              <SortDesc size={16} className="mr-1" /> Newest
            </Button>
            <Button
              variant={sortOption === SortOption.OLDEST ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChangeSortOption(SortOption.OLDEST)}
              className="rounded-none border-0"
            >
              <SortAsc size={16} className="mr-1" /> Oldest
            </Button>
            <Button
              variant={sortOption === SortOption.ALPHABETICAL ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChangeSortOption(SortOption.ALPHABETICAL)}
              className="rounded-none border-0"
            >
              A-Z
            </Button>
            <Button
              variant={sortOption === SortOption.RECENTLY_UPDATED ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChangeSortOption(SortOption.RECENTLY_UPDATED)}
              className="rounded-none border-0"
            >
              <Calendar size={16} className="mr-1" /> Updated
            </Button>
          </div>
          
          <div className="flex border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <Button
              variant={viewMode === ViewMode.GRID ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChangeViewMode(ViewMode.GRID)}
              className="rounded-none border-0"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === ViewMode.LIST ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChangeViewMode(ViewMode.LIST)}
              className="rounded-none border-0"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No prompts found</p>
        </div>
      ) : viewMode === ViewMode.GRID ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onToggleFavorite={onToggleFavorite}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onToggleFavorite={onToggleFavorite}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptList;
