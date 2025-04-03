import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Star, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { Prompt } from '../../types';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onToggleFavorite,
  onToggleVisibility,
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/prompts/${prompt.id}`);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(prompt.id);
  };
  
  const handleVisibilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility?.(prompt.id);
  };
  
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open dropdown menu
  };
  
  return (
    <Card className="h-full flex flex-col" onClick={handleCardClick}>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {prompt.title}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={handleFavoriteClick}
              className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
            >
              <Star
                size={18}
                className={prompt.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}
              />
            </button>
            <button
              onClick={handleVisibilityClick}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {prompt.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button
              onClick={handleMoreClick}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-3">
          {prompt.content}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {prompt.tags.map((tag, index) => (
            <Badge key={index} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <div>
          {prompt.isPublic ? (
            <Badge variant="primary" className="text-xs">Public</Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">Private</Badge>
          )}
        </div>
        <div>
          Updated {format(new Date(prompt.updatedAt), 'MMM d, yyyy')}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PromptCard;
