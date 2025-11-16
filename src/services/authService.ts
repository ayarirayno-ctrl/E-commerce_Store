import axios from 'axios';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

// Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
}

// Configuration axios avec token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class AuthService {
  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, data);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      
      // Sauvegarder le token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Erreur lors de la connexion');
    }
  }

  // Vérification email
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify-email/${token}`);
      
      // Sauvegarder le token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Erreur lors de la vérification');
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Vérifier si connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Récupérer le profil
  async getProfile() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
  }

  // Mettre à jour le profil
  async updateProfile(data: UpdateProfileData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, data, {
        headers: getAuthHeader()
      });
      
      // Mettre à jour l'utilisateur dans localStorage
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
      }
      
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  }
}

export default new AuthService();
