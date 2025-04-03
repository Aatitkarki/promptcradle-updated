import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Prompt, SortOption, ViewMode } from '../types';

interface PromptState {
  prompts: Prompt[];
  sortOption: SortOption;
  viewMode: ViewMode;
  searchQuery: string;
  activeTag: string | null;
  activeCollection: string | null;
  
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => string;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleVisibility: (id: string) => void;
  
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setActiveTag: (tag: string | null) => void;
  setActiveCollection: (collectionId: string | null) => void;
  
  getPromptById: (id: string) => Prompt | undefined;
  getPromptsByCollection: (collectionId: string) => Prompt[];
  getFavoritePrompts: () => Prompt[];
}

// Sample data for demonstration
const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Flutter dev prompt',
    content: 'You are expert mobile application developer. You are expert on creating native as well as hybrid mobile applications. Your job is to create the best mobile applications. Here is the code you need to write {{data1}} and you need to follow {{data2}}',
    tags: ['mobile app', 'devops'],
    isPublic: true,
    isFavorite: false,
    createdAt: new Date('2025-03-22'),
    updatedAt: new Date('2025-03-22'),
    createdBy: 'aatit',
    version: 1,
    placeholders: [
      { id: '1', name: 'data1' },
      { id: '2', name: 'data2' }
    ],
    collectionId: 'c1'
  }
];

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: samplePrompts,
  sortOption: SortOption.NEWEST,
  viewMode: ViewMode.GRID,
  searchQuery: '',
  activeTag: null,
  activeCollection: null,
  
  addPrompt: (promptData) => {
    const id = uuidv4();
    const now = new Date();
    
    // Extract placeholders from content
    const extractPlaceholders = (content: string) => {
      const regex = /{{([^{}]+)}}/g;
      const matches = [...content.matchAll(regex)];
      
      const extractedPlaceholders = matches.map(match => ({
        id: uuidv4(),
        name: match[1]
      }));
      
      // Filter out duplicates by name
      return extractedPlaceholders.filter(
        (placeholder, index, self) => 
          index === self.findIndex(p => p.name === placeholder.name)
      );
    };
    
    const placeholders = promptData.placeholders || 
      extractPlaceholders(promptData.content || '');
    
    const newPrompt: Prompt = {
      id,
      ...promptData,
      placeholders,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    
    set((state) => ({
      prompts: [newPrompt, ...state.prompts]
    }));
    
    return id;
  },
  
  updatePrompt: (id, updates) => {
    set((state) => {
      const prompt = state.prompts.find(p => p.id === id);
      
      if (!prompt) return state;
      
      // If content is updated, extract placeholders
      let placeholders = updates.placeholders;
      if (updates.content && updates.content !== prompt.content) {
        const regex = /{{([^{}]+)}}/g;
        const matches = [...updates.content.matchAll(regex)];
        
        const extractedPlaceholders = matches.map(match => ({
          id: uuidv4(),
          name: match[1]
        }));
        
        // Filter out duplicates by name
        placeholders = extractedPlaceholders.filter(
          (placeholder, index, self) => 
            index === self.findIndex(p => p.name === placeholder.name)
        );
      }
      
      return {
        prompts: state.prompts.map((prompt) => 
          prompt.id === id 
            ? { 
                ...prompt, 
                ...updates,
                placeholders: placeholders || prompt.placeholders,
                updatedAt: new Date(),
                version: prompt.version + 1
              } 
            : prompt
        )
      };
    });
  },
  
  deletePrompt: (id) => {
    set((state) => ({
      prompts: state.prompts.filter((prompt) => prompt.id !== id)
    }));
  },
  
  toggleFavorite: (id) => {
    set((state) => ({
      prompts: state.prompts.map((prompt) => 
        prompt.id === id 
          ? { ...prompt, isFavorite: !prompt.isFavorite } 
          : prompt
      )
    }));
  },
  
  toggleVisibility: (id) => {
    set((state) => ({
      prompts: state.prompts.map((prompt) => 
        prompt.id === id 
          ? { ...prompt, isPublic: !prompt.isPublic } 
          : prompt
      )
    }));
  },
  
  setSortOption: (option) => {
    set({ sortOption: option });
  },
  
  setViewMode: (mode) => {
    set({ viewMode: mode });
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setActiveTag: (tag) => {
    set({ activeTag: tag });
  },
  
  setActiveCollection: (collectionId) => {
    set({ activeCollection: collectionId });
  },
  
  getPromptById: (id) => {
    return get().prompts.find((prompt) => prompt.id === id);
  },
  
  getPromptsByCollection: (collectionId) => {
    return get().prompts.filter((prompt) => prompt.collectionId === collectionId);
  },
  
  getFavoritePrompts: () => {
    return get().prompts.filter((prompt) => prompt.isFavorite);
  }
}));
