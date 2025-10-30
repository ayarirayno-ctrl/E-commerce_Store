import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { AxiosError } from 'axios';
import { useNotification } from '../hooks/useNotification';
import { useAppDispatch } from '../store';
import { fetchCart } from '../store/slices/cartSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiError {
  message?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
  emailVerified?: boolean;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();
  const dispatch = useAppDispatch();

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set axios default header
  // Authorization sera ajouté automatiquement par l'interceptor via localStorage
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
  const response = await api.post(`${API_URL}/client-auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const userData: User = {
          id: response.data.client.id,
          name: response.data.client.name,
          email: response.data.client.email,
          phone: response.data.client.phone,
          address: response.data.client.address,
          avatar: response.data.client.avatar,
          emailVerified: response.data.client.emailVerified,
          token: response.data.token,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set axios default header
  // Authorization sera ajouté automatiquement par l'interceptor via localStorage
        
        // Sync cart from backend
        dispatch(fetchCart());
        
        showSuccess('Login successful!');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Invalid email or password';
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
  const response = await api.post(`${API_URL}/client-auth/register`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        const userData: User = {
          id: response.data.client.id,
          name: response.data.client.name,
          email: response.data.client.email,
          phone: response.data.client.phone,
          address: response.data.client.address,
          avatar: response.data.client.avatar,
          emailVerified: response.data.client.emailVerified,
          token: response.data.token,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set axios default header
  // Authorization sera ajouté automatiquement par l'interceptor via localStorage
        
        // Sync cart from backend
        dispatch(fetchCart());
        
        showSuccess('Registration successful! Welcome!');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Registration failed';
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  // L'interceptor lit depuis localStorage, retirer l'utilisateur suffit
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
  const response = await api.put(`${API_URL}/client-auth/profile`, {
        name: data.name,
        phone: data.phone,
        address: data.address,
      });

      if (response.data.success) {
        const updatedUser: User = {
          ...user!,
          name: response.data.client.name,
          email: response.data.client.email,
          phone: response.data.client.phone,
          address: response.data.client.address,
          avatar: response.data.client.avatar,
          emailVerified: response.data.client.emailVerified,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error: unknown) {
      console.error('Update profile failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Profile update failed';
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
