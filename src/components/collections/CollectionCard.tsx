import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Folder, MoreHorizontal } from 'lucide-react';
import { Collection } from '../../types';
import { usePromptStore } from '../../store/promptStore';
import Card, { CardContent, CardFooter } from '../ui/Card';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const navigate = useNavigate();
  const { prompts } = usePromptStore();
  
  const promptCount = collection.promptIds.length;
  const collectionPrompts = prompts.filter(prompt => 
    collection.promptIds.includes(prompt.id)
  );
  
  const handleCardClick = () => {
    navigate(`/collections/${collection.id}`);
  };
  
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open dropdown menu
  };
  
  return (
    <Card className="h-full flex flex-col" onClick={handleCardClick}>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Folder className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {collection.name}
            </h3>
          </div>
          <button
            onClick={handleMoreClick}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
        
        {collection.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {collection.description}
          </p>
        )}
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {promptCount} {promptCount === 1 ? 'prompt' : 'prompts'}
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-gray-500 dark:text-gray-400">
        Created {format(new Date(collection.createdAt), 'MMM d, yyyy')}
      </CardFooter>
    </Card>
  );
};

export default CollectionCard;
