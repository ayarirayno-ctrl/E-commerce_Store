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
  role?: string;
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
  login: (email: string, password: string) => Promise<User>;
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

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const userData: User = {
        id: response.data.user.id || response.data.user._id,
        name: `${response.data.user.firstName} ${response.data.user.lastName}`,
        email: response.data.user.email,
        role: response.data.user.role,
        phone: response.data.user.phone,
        address: response.data.user.address,
        avatar: response.data.user.avatar,
        emailVerified: response.data.user.isEmailVerified,
        token: response.data.token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
        
      // Sync cart from backend
      dispatch(fetchCart());
        
      showSuccess('Connexion réussie !');
      
      return userData;
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      
      // Extract error message from API response
      const errorMessage = axiosError.response?.data?.message || 'Login failed';
      
      // Show error notification with the message from backend (includes "You are blocked from admin device")
      showError(errorMessage);
      
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Séparer le prénom et nom
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      const response = await api.post(`${API_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      showSuccess(response.data.message || 'Inscription réussie ! Vérifiez votre email pour activer votre compte.');
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Erreur lors de l\'inscription';
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showSuccess('Déconnexion réussie!');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const response = await api.put(`${API_URL}/users/profile`, {
        phone: data.phone,
        address: data.address,
      });

      const updatedUser: User = {
        ...user!,
        phone: response.data.user.phone,
        address: response.data.user.address,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showSuccess('Profil mis à jour!');
    } catch (error: unknown) {
      console.error('Update profile failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Erreur lors de la mise à jour du profil';
      showError(errorMessage);
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
