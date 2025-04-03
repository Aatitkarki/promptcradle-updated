import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Collection } from '../types';

interface CollectionState {
  collections: Collection[];
  addCollection: (name: string, description?: string) => string;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addPromptToCollection: (collectionId: string, promptId: string) => void;
  removePromptFromCollection: (collectionId: string, promptId: string) => void;
  getCollectionById: (id: string) => Collection | undefined;
}

// Sample data for demonstration
const sampleCollections: Collection[] = [
  {
    id: 'c1',
    name: 'Development',
    description: 'Prompts for software development',
    createdAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-03-20'),
    createdBy: 'demouser',
    promptIds: []
  },
  {
    id: 'c2',
    name: 'Writing',
    description: 'Prompts for creative writing',
    createdAt: new Date('2025-03-21'),
    updatedAt: new Date('2025-03-21'),
    createdBy: 'demouser',
    promptIds: []
  }
];

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: sampleCollections,
  
  addCollection: (name, description) => {
    const id = uuidv4();
    const now = new Date();
    const newCollection: Collection = {
      id,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      createdBy: 'demouser',
      promptIds: []
    };
    
    set((state) => ({
      collections: [...state.collections, newCollection]
    }));
    
    return id;
  },
  
  updateCollection: (id, updates) => {
    set((state) => ({
      collections: state.collections.map((collection) => 
        collection.id === id 
          ? { ...collection, ...updates, updatedAt: new Date() } 
          : collection
      )
    }));
  },
  
  deleteCollection: (id) => {
    set((state) => ({
      collections: state.collections.filter((collection) => collection.id !== id)
    }));
  },
  
  addPromptToCollection: (collectionId, promptId) => {
    set((state) => ({
      collections: state.collections.map((collection) => 
        collection.id === collectionId && !collection.promptIds.includes(promptId)
          ? { 
              ...collection, 
              promptIds: [...collection.promptIds, promptId],
              updatedAt: new Date()
            } 
          : collection
      )
    }));
  },
  
  removePromptFromCollection: (collectionId, promptId) => {
    set((state) => ({
      collections: state.collections.map((collection) => 
        collection.id === collectionId
          ? { 
              ...collection, 
              promptIds: collection.promptIds.filter(id => id !== promptId),
              updatedAt: new Date()
            } 
          : collection
      )
    }));
  },
  
  getCollectionById: (id) => {
    return get().collections.find((collection) => collection.id === id);
  }
}));
