import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePromptStore } from '../store/promptStore';
import PromptForm from '../components/prompts/PromptForm';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPrompt } = usePromptStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    try {
      const promptId = addPrompt({
        ...data,
        createdBy: 'demouser',
      });
      
      toast.success('Prompt created successfully');
      navigate(`/prompts/${promptId}`);
    } catch (error) {
      toast.error('Failed to create prompt');
      setIsSubmitting(false);
    }
  };
  
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Prompt</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new prompt template with optional placeholders for dynamic content.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <PromptForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreatePromptPage;
