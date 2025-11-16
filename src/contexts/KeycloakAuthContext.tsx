import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
  register: () => void;
  getToken: () => string | undefined;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const KeycloakAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized) {
      setLoading(false);
      
      if (keycloak.authenticated && keycloak.tokenParsed) {
        const tokenParsed = keycloak.tokenParsed as any;
        const roles = tokenParsed.realm_access?.roles || [];
        
        setUser({
          id: tokenParsed.sub || '',
          email: tokenParsed.email || '',
          name: tokenParsed.name || tokenParsed.preferred_username || '',
          role: roles.includes('admin') ? 'admin' : 'user',
          roles: roles
        });
      } else {
        setUser(null);
      }
    }
  }, [initialized, keycloak.authenticated, keycloak.tokenParsed]);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    setUser(null);
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const register = () => {
    keycloak.register();
  };

  const getToken = () => {
    return keycloak.token;
  };

  const hasRole = (role: string): boolean => {
    return keycloak.hasRealmRole(role);
  };

  const isAdmin = keycloak.hasRealmRole('admin');
  const isAuthenticated = keycloak.authenticated || false;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    register,
    getToken,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
