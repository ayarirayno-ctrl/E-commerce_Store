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
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
      console.log('🔐 Attempting login via backend API...', { email });
      
      // Use backend JWT API for authentication
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      console.log('✅ Login successful:', response.data);
      
      const { token, user: userData } = response.data;
      
      const user: User = {
        id: userData._id || userData.id,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role || 'user',
        phone: userData.phone,
        address: userData.address,
        avatar: userData.avatar,
        emailVerified: userData.isEmailVerified,
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Set token for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      
      // Load user's cart
      dispatch(fetchCart());

      showSuccess('Login successful!');
      return user;
    } catch (error) {
      console.error('❌ Login error:', error);
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Invalid credentials';
      showError(message);
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
    setUser,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};