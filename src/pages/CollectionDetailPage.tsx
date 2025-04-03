import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useCollectionStore } from '../store/collectionStore';
import { usePromptStore } from '../store/promptStore';
import PromptList from '../components/prompts/PromptList';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CollectionForm from '../components/collections/CollectionForm';
import { SortOption, ViewMode } from '../types';
import toast from 'react-hot-toast';

const CollectionDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getCollectionById, updateCollection, deleteCollection } = useCollectionStore();
  const { prompts, toggleFavorite, toggleVisibility, sortOption, viewMode, setSortOption, setViewMode } = usePromptStore();
  
  const [collection, setCollection] = useState(getCollectionById(id || ''));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!collection) {
      toast.error('Collection not found');
      navigate('/collections');
    }
  }, [collection, navigate]);
  
  const collectionPrompts = prompts.filter(prompt => 
    collection?.promptIds.includes(prompt.id)
  );
  
  const handleUpdateCollection = (data: { name: string; description?: string }) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      updateCollection(id, data);
      setCollection(getCollectionById(id));
      toast.success('Collection updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update collection');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteCollection = () => {
    if (!id) return;
    
    deleteCollection(id);
    toast.success('Collection deleted successfully');
    navigate('/collections');
  };
  
  if (!collection) {
    return null;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/collections')}
        >
          Back to Collections
        </Button>
      </div>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{collection.name}</h1>
          {collection.description && (
            <p className="mt-1 text-gray-500 dark:text-gray-400">{collection.description}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit size={16} />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Prompts in this collection
        </h2>
        
        {collectionPrompts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No prompts in this collection yet
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/prompts/new')}
            >
              Create New Prompt
            </Button>
          </div>
        ) : (
          <PromptList
            prompts={collectionPrompts}
            viewMode={viewMode}
            sortOption={sortOption}
            onToggleFavorite={toggleFavorite}
            onToggleVisibility={toggleVisibility}
            onChangeViewMode={setViewMode}
            onChangeSortOption={setSortOption}
          />
        )}
      </div>
      
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Collection"
      >
        <CollectionForm
          initialData={collection}
          onSubmit={handleUpdateCollection}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Collection"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this collection? This action cannot be undone.
            The prompts in this collection will not be deleted.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteCollection}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CollectionDetailPage;
