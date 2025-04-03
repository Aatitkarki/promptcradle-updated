import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Prompt, Placeholder, Collection } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Badge from '../ui/Badge';
import { useCollectionStore } from '../../store/collectionStore';

interface PromptFormProps {
  initialData?: Partial<Prompt>;
  onSubmit: (data: Partial<Prompt>) => void;
  isSubmitting?: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const { collections } = useCollectionStore();
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [isPublic, setIsPublic] = useState(initialData.isPublic ?? true);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(
    initialData.placeholders || []
  );
  const [collectionId, setCollectionId] = useState<string | undefined>(
    initialData.collectionId
  );
  const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);
  
  // Extract placeholders from content whenever it changes
  useEffect(() => {
    const extractPlaceholders = () => {
      const regex = /{{([^{}]+)}}/g;
      const matches = [...content.matchAll(regex)];
      
      const extractedPlaceholders: Placeholder[] = matches.map(match => ({
        id: Date.now() + '-' + match[1],
        name: match[1]
      }));
      
      // Filter out duplicates by name
      const uniquePlaceholders = extractedPlaceholders.filter(
        (placeholder, index, self) => 
          index === self.findIndex(p => p.name === placeholder.name)
      );
      
      setPlaceholders(uniquePlaceholders);
    };
    
    extractPlaceholders();
  }, [content]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      content,
      isPublic,
      tags,
      placeholders,
      collectionId
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };
  
  const toggleCollectionDropdown = () => {
    setIsCollectionDropdownOpen(!isCollectionDropdownOpen);
  };
  
  const selectCollection = (collection: Collection) => {
    setCollectionId(collection.id);
    setIsCollectionDropdownOpen(false);
  };
  
  const getSelectedCollectionName = () => {
    if (!collectionId) return 'Select a collection';
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.name : 'Select a collection';
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter prompt title"
        required
      />
      
      <div>
        <Textarea
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your prompt here... Use {{placeholderName}} for dynamic content"
          rows={8}
          required
        />
        {placeholders.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Detected placeholders: {placeholders.map(p => `{{${p.name}}}`).join(', ')}
            </p>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        <div className="flex">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => handleKeyDown(e, handleAddTag)}
            className="rounded-r-none"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            className="rounded-l-none"
          >
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Collection
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
              shadow-sm transition-colors
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
              dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            onClick={toggleCollectionDropdown}
          >
            <span>{getSelectedCollectionName()}</span>
            <ChevronDown size={16} />
          </button>
          
          {isCollectionDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <ul className="py-1 max-h-60 overflow-auto">
                {collections.length > 0 ? (
                  collections.map((collection) => (
                    <li 
                      key={collection.id}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => selectCollection(collection)}
                    >
                      {collection.name}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No collections available
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Make this prompt public
        </label>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData.id ? 'Update Prompt' : 'Create Prompt'}
        </Button>
      </div>
    </form>
  );
};

export default PromptForm;
