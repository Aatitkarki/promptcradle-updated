export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  isFavorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  version: number;
  placeholders: Placeholder[];
  collectionId?: string;
}

export interface Placeholder {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  promptIds: string[];
}

export enum SortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  ALPHABETICAL = 'alphabetical',
  RECENTLY_UPDATED = 'recently_updated'
}

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list'
}
