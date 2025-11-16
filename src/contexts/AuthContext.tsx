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

  // Initialize auth state ONCE on mount - NO DEPENDENCIES
  useEffect(() => {
    let isMounted = true;

    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (isMounted && parsedUser && parsedUser.id) {
              setUser(parsedUser);
              // Set token for API calls
              api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } else {
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
      };

      const token = response.data.token;

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);

      // Set token for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      
      // Load user's cart
      dispatch(fetchCart());

      return userData;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });

      showSuccess('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      
      // Clear cart data
      dispatch({ type: 'cart/clearCart' });
      
      showSuccess('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const response = await api.put('/auth/profile', data);
      
      const updatedUser = {
        ...user!,
        ...response.data.user,
        name: `${response.data.user.firstName} ${response.data.user.lastName}`,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      showSuccess('Profile updated successfully');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Profile update failed';
      showError(message);
      throw new Error(message);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};