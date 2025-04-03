import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePromptStore } from '../store/promptStore';
import PromptDetail from '../components/prompts/PromptDetail';
import PromptVersionHistory from '../components/prompts/PromptVersionHistory';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const PromptDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getPromptById, updatePrompt, deletePrompt, toggleFavorite } = usePromptStore();
  
  const [prompt, setPrompt] = useState(getPromptById(id || ''));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  useEffect(() => {
    if (!prompt) {
      toast.error('Prompt not found');
      navigate('/');
    }
  }, [prompt, navigate]);
  
  const handleEdit = () => {
    navigate(`/prompts/${id}/edit`);
  };
  
  const handleDelete = () => {
    if (!id) return;
    
    deletePrompt(id);
    toast.success('Prompt deleted successfully');
    navigate('/');
  };
  
  const handleToggleFavorite = () => {
    if (!id) return;
    
    toggleFavorite(id);
    setPrompt(getPromptById(id));
    
    toast.success(
      prompt?.isFavorite 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
  };
  
  const handleRestoreVersion = (version: number) => {
    // In a real app, this would restore a specific version
    toast.success(`Restored to version ${version}`);
  };
  
  if (!prompt) {
    return null;
  }
  
  // Mock version history for demo
  const versionHistory = [
    {
      version: 1,
      updatedAt: prompt.createdAt,
      changes: ['Initial version'],
    },
  ];
  
  if (prompt.version > 1) {
    for (let i = 2; i <= prompt.version; i++) {
      versionHistory.push({
        version: i,
        updatedAt: prompt.updatedAt,
        changes: ['Updated content', 'Modified placeholders'],
      });
    }
  }
  
  const tabs = [
    {
      id: 'prompt',
      label: 'Prompt',
      content: (
        <PromptDetail
          prompt={prompt}
          onEdit={handleEdit}
          onDelete={() => setIsDeleteModalOpen(true)}
          onToggleFavorite={handleToggleFavorite}
        />
      ),
    },
    {
      id: 'history',
      label: 'History',
      content: (
        <PromptVersionHistory
          versions={versionHistory}
          currentVersion={prompt.version}
          onRestoreVersion={handleRestoreVersion}
        />
      ),
    },
  ];
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Back to Prompts
        </Button>
      </div>
      
      <Tabs tabs={tabs} defaultTabId="prompt" />
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Prompt"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this prompt? This action cannot be undone.
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
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PromptDetailPage;
