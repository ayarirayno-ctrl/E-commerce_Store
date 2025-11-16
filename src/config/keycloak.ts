import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:9090',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecommerce',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-app',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Keycloak initialization options
export const keycloakInitOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256' as const,
  checkLoginIframe: false, // Désactiver pour éviter les problèmes CORS
  flow: 'standard' as const,
};

// Helper functions
export const getToken = () => keycloak.token;
export const getRefreshToken = () => keycloak.refreshToken;
export const isAuthenticated = () => !!keycloak.authenticated;
export const getUserInfo = () => keycloak.tokenParsed;
export const hasRole = (role: string) => keycloak.hasRealmRole(role);
export const isAdmin = () => keycloak.hasRealmRole('admin');
export const login = () => keycloak.login();
export const logout = () => keycloak.logout({ redirectUri: window.location.origin });
export const register = () => keycloak.register();

// Auto refresh token
export const setupTokenRefresh = () => {
  // Refresh token every 5 minutes
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed');
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 5 * 60 * 1000);
};

export default keycloak;
