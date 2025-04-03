import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePromptStore } from '../store/promptStore';
import PromptForm from '../components/prompts/PromptForm';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const EditPromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getPromptById, updatePrompt } = usePromptStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompt, setPrompt] = useState(getPromptById(id || ''));
  
  useEffect(() => {
    if (!prompt) {
      toast.error('Prompt not found');
      navigate('/');
    }
  }, [prompt, navigate]);
  
  const handleSubmit = (data: any) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      updatePrompt(id, data);
      toast.success('Prompt updated successfully');
      navigate(`/prompts/${id}`);
    } catch (error) {
      toast.error('Failed to update prompt');
      setIsSubmitting(false);
    }
  };
  
  if (!prompt) {
    return null;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Prompt</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your prompt template and placeholders.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <PromptForm
          initialData={prompt}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditPromptPage;
