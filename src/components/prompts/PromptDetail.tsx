import React, { useState } from 'react';
import { format } from 'date-fns';
import { Copy, Star, Edit, Trash2, Share2, Download } from 'lucide-react';
import { Prompt } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';

interface PromptDetailProps {
  prompt: Prompt;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
}

const PromptDetail: React.FC<PromptDetailProps> = ({
  prompt,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  
  const handleCopy = () => {
    let contentToCopy = prompt.content;
    
    // Replace placeholders with their values if available
    if (prompt.placeholders && prompt.placeholders.length > 0) {
      prompt.placeholders.forEach(placeholder => {
        const value = placeholderValues[placeholder.name] || `{{${placeholder.name}}}`;
        contentToCopy = contentToCopy.replace(
          new RegExp(`{{${placeholder.name}}}`, 'g'),
          value
        );
      });
    }
    
    // Create a temporary textarea element to copy text
    const textArea = document.createElement('textarea');
    textArea.value = contentToCopy;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // Select and copy the text
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    
    // Clean up
    document.body.removeChild(textArea);
    
    if (success) {
      toast.success('Prompt copied to clipboard');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const handleExport = () => {
    const exportData = {
      ...prompt,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handlePlaceholderChange = (name: string, value: string) => {
    setPlaceholderValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const getPreviewContent = () => {
    let previewContent = prompt.content;
    
    // Replace placeholders with their values if available
    if (prompt.placeholders && prompt.placeholders.length > 0) {
      prompt.placeholders.forEach(placeholder => {
        const value = placeholderValues[placeholder.name] || `{{${placeholder.name}}}`;
        previewContent = previewContent.replace(
          new RegExp(`{{${placeholder.name}}}`, 'g'),
          value
        );
      });
    }
    
    return previewContent;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{prompt.title}</h1>
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Version {prompt.version}</span>
            <span className="mx-2">•</span>
            <span>Created {format(new Date(prompt.createdAt), 'MMM d, yyyy')}</span>
            <span className="mx-2">•</span>
            <span>Updated {format(new Date(prompt.updatedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Star className={prompt.isFavorite ? 'fill-yellow-400' : ''} />}
            onClick={onToggleFavorite}
          >
            {prompt.isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit />}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {prompt.tags.map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
        
        <Badge variant={prompt.isPublic ? 'primary' : 'secondary'}>
          {prompt.isPublic ? 'Public' : 'Private'}
        </Badge>
      </div>
      
      {prompt.placeholders && prompt.placeholders.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Placeholders
          </h3>
          <div className="space-y-3">
            {prompt.placeholders.map((placeholder) => (
              <div key={placeholder.id}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {placeholder.name}
                </label>
                <input
                  type="text"
                  value={placeholderValues[placeholder.name] || ''}
                  onChange={(e) => handlePlaceholderChange(placeholder.name, e.target.value)}
                  placeholder={`Enter value for ${placeholder.name}...`}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
                    shadow-sm transition-colors placeholder-gray-400
                    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {prompt.placeholders && prompt.placeholders.length > 0 
              ? 'Preview with replaced placeholders' 
              : 'Prompt content'}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Copy />}
              onClick={handleCopy}
            >
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Share2 />}
            >
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download />}
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 whitespace-pre-wrap">
          {getPreviewContent()}
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
