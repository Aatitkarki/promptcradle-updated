import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface CollectionFormProps {
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
  };
  onSubmit: (data: { name: string; description?: string }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      description: description || undefined,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Collection name"
        required
      />
      
      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        rows={3}
      />
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {initialData.id ? 'Update Collection' : 'Create Collection'}
        </Button>
      </div>
    </form>
  );
};

export default CollectionForm;
