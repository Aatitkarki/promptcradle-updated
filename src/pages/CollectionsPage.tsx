import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCollectionStore } from '../store/collectionStore';
import CollectionCard from '../components/collections/CollectionCard';
import CollectionForm from '../components/collections/CollectionForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const CollectionsPage: React.FC = () => {
  const { collections, addCollection } = useCollectionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateCollection = (data: { name: string; description?: string }) => {
    setIsSubmitting(true);
    
    try {
      addCollection(data.name, data.description);
      toast.success('Collection created successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create collection');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collections</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center"
        >
          <Plus size={16} className="mr-1" /> New Collection
        </Button>
      </div>
      
      {collections.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No collections yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first collection to organize your prompts
          </p>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Collection"
      >
        <CollectionForm
          onSubmit={handleCreateCollection}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default CollectionsPage;
