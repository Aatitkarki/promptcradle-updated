import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate a successful login
    if (email && password) {
      set({
        user: {
          id: '1',
          username: 'demouser',
          email: email
        },
        isAuthenticated: true
      });
      return true;
    }
    return false;
  },
  
  signup: async (username: string, email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate a successful signup
    if (username && email && password) {
      set({
        user: {
          id: '1',
          username,
          email
        },
        isAuthenticated: true
      });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false
    });
  }
}));
