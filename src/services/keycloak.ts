import Keycloak from 'keycloak-js';

// Configuration Keycloak pour Admin
const keycloakConfigAdmin = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecommerce',
  clientId: import.meta.env.VITE_KEYCLOAK_ADMIN_CLIENT || 'ecommerce-admin'
};

// Configuration Keycloak pour Users
const keycloakConfigUser = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecommerce',
  clientId: import.meta.env.VITE_KEYCLOAK_USER_CLIENT || 'ecommerce-frontend'
};

// Instance Keycloak pour Admin
export const keycloakAdmin = new Keycloak(keycloakConfigAdmin);

// Instance Keycloak pour Users
export const keycloakUser = new Keycloak(keycloakConfigUser);

// Options d'initialisation
const initOptions = {
  onLoad: 'check-sso' as const,
  checkLoginIframe: false,
  pkceMethod: 'S256' as const
};

// Initialiser Keycloak Admin
export const initKeycloakAdmin = async (): Promise<boolean> => {
  try {
    const authenticated = await keycloakAdmin.init(initOptions);
    
    if (authenticated) {
      console.log('✅ Admin authentifié via Keycloak');
      
      // Rafraîchir le token automatiquement
      setInterval(() => {
        keycloakAdmin.updateToken(70).catch(() => {
          console.error('❌ Échec du rafraîchissement du token admin');
        });
      }, 60000); // Toutes les minutes
    }
    
    return authenticated;
  } catch (error) {
    console.error('❌ Erreur initialisation Keycloak Admin:', error);
    return false;
  }
};

// Initialiser Keycloak User
export const initKeycloakUser = async (): Promise<boolean> => {
  try {
    const authenticated = await keycloakUser.init(initOptions);
    
    if (authenticated) {
      console.log('✅ User authentifié via Keycloak');
      
      // Rafraîchir le token automatiquement
      setInterval(() => {
        keycloakUser.updateToken(70).catch(() => {
          console.error('❌ Échec du rafraîchissement du token user');
        });
      }, 60000);
    }
    
    return authenticated;
  } catch (error) {
    console.error('❌ Erreur initialisation Keycloak User:', error);
    return false;
  }
};

// Fonction de connexion Admin
export const loginAdmin = () => {
  keycloakAdmin.login({
    redirectUri: window.location.origin + '/admin'
  });
};

// Fonction de connexion User
export const loginUser = () => {
  keycloakUser.login({
    redirectUri: window.location.origin
  });
};

// Fonction de déconnexion Admin
export const logoutAdmin = () => {
  keycloakAdmin.logout({
    redirectUri: window.location.origin
  });
};

// Fonction de déconnexion User
export const logoutUser = () => {
  keycloakUser.logout({
    redirectUri: window.location.origin
  });
};

// Obtenir le token Admin
export const getAdminToken = (): string | undefined => {
  return keycloakAdmin.token;
};

// Obtenir le token User
export const getUserToken = (): string | undefined => {
  return keycloakUser.token;
};

// Vérifier si l'utilisateur a un rôle spécifique (Admin)
export const hasAdminRole = (role: string): boolean => {
  return keycloakAdmin.hasRealmRole(role);
};

// Vérifier si l'utilisateur a un rôle spécifique (User)
export const hasUserRole = (role: string): boolean => {
  return keycloakUser.hasRealmRole(role);
};

// Obtenir les informations de l'utilisateur Admin
export const getAdminInfo = () => {
  if (!keycloakAdmin.tokenParsed) return null;
  
  return {
    id: keycloakAdmin.tokenParsed.sub,
    username: keycloakAdmin.tokenParsed.preferred_username,
    email: keycloakAdmin.tokenParsed.email,
    firstName: keycloakAdmin.tokenParsed.given_name,
    lastName: keycloakAdmin.tokenParsed.family_name,
    roles: keycloakAdmin.tokenParsed.realm_access?.roles || [],
    emailVerified: keycloakAdmin.tokenParsed.email_verified
  };
};

// Obtenir les informations de l'utilisateur User
export const getUserInfo = () => {
  if (!keycloakUser.tokenParsed) return null;
  
  return {
    id: keycloakUser.tokenParsed.sub,
    username: keycloakUser.tokenParsed.preferred_username,
    email: keycloakUser.tokenParsed.email,
    firstName: keycloakUser.tokenParsed.given_name,
    lastName: keycloakUser.tokenParsed.family_name,
    roles: keycloakUser.tokenParsed.realm_access?.roles || [],
    emailVerified: keycloakUser.tokenParsed.email_verified
  };
};

// Vérifier si Admin est authentifié
export const isAdminAuthenticated = (): boolean => {
  return keycloakAdmin.authenticated || false;
};

// Vérifier si User est authentifié
export const isUserAuthenticated = (): boolean => {
  return keycloakUser.authenticated || false;
};

// Créer un compte utilisateur (via Keycloak registration)
export const registerUser = () => {
  keycloakUser.register({
    redirectUri: window.location.origin
  });
};

export default {
  keycloakAdmin,
  keycloakUser,
  initKeycloakAdmin,
  initKeycloakUser,
  loginAdmin,
  loginUser,
  logoutAdmin,
  logoutUser,
  getAdminToken,
  getUserToken,
  hasAdminRole,
  hasUserRole,
  getAdminInfo,
  getUserInfo,
  isAdminAuthenticated,
  isUserAuthenticated,
  registerUser
};
