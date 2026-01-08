import { create } from 'zustand';
import { User } from '@types/index';
import api from '@services/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, username: string, full_name: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/auth/register', {
        email,
        username,
        full_name,
        password,
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      const response = await api.get('/api/v1/auth/me');
      set({ user: response.data });
    } catch (error) {
      set({ isAuthenticated: false, token: null });
      localStorage.removeItem('token');
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },
}));
