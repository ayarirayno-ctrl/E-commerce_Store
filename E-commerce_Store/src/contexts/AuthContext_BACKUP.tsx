import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { AxiosError } from 'axios';
import { useNotification } from '../hooks/useNotification';
import { useAppDispatch } from '../store';
import { fetchCart } from '../store/slices/cartSlice';

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
  loginClient: (email: string, password: string) => Promise<User>;
  loginAdmin: (email: string, password: string) => Promise<User>;
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

  // Initialize auth state ONCE on mount - NO DEPENDENCIES
  useEffect(() => {
    let isMounted = true;

    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken && isMounted) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.email && storedToken.length > 10) {
              setUser(parsedUser);
              console.log('✅ Auth restored:', parsedUser.email);
            } else {
              console.log('⚠️ Invalid stored data, clearing...');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Small delay to prevent race conditions
    const timer = setTimeout(initAuth, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []); // EMPTY ARRAY - NEVER RE-RUN

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/auth/login', {
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

  const loginClient = async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/client-auth/login', {
        email,
        password,
      });

      const userData: User = {
        id: response.data.user.id || response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: 'client',
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
      console.error('Client login failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || 'Erreur de connexion';
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const loginAdmin = async (email: string, password: string): Promise<User> => {
    try {
      console.log('🔐 Admin Login attempt:', { email });
      
      const response = await api.post('/admin/auth/login', {
        email,
        password,
      });

      console.log('📊 Admin Login response:', response.data);

      // Support both response formats for compatibility
      const adminData = response.data.admin || response.data;
      const token = response.data.token;

      if (!adminData || !token) {
        throw new Error('Invalid response format from server');
      }

      const userData: User = {
        id: adminData.id || adminData._id,
        name: adminData.name,
        email: adminData.email,
        role: 'admin',
        token: token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
        
      showSuccess('Connexion admin réussie !');
      
      return userData;
    } catch (error: unknown) {
      console.error('❌ Admin login failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      
      // Log detailed error information
      if (axiosError.response) {
        console.error('Response status:', axiosError.response.status);
        console.error('Response data:', axiosError.response.data);
      }
      
      const errorMessage = axiosError.response?.data?.message || 'Erreur de connexion admin';
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/client-auth/register', {
        name,
        email,
        password,
      });

      showSuccess(response.data.message || 'Inscription réussie !');
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Erreur lors de l\'inscription';
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    
    // Clear any potentially problematic keys
    const keysToRemove = ['auth_state', 'user_data', 'access_token'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    showSuccess('Déconnexion réussie');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const response = await api.put('/users/profile', {
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
    loginClient,
    loginAdmin,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
