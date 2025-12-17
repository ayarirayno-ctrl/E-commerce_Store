import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  console.log('🔍 AuthContext available:', authContext);
  console.log('🔍 setUser available:', typeof authContext.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Admin login attempt:', { email });

    try {
      // Use backend admin API for authentication
      const response = await api.post('/admin/auth/login', {
        email,
        password,
      });

      console.log('✅ Admin login successful:', response.data);

      const { token, admin } = response.data;

      // Create admin user object
      const adminUser = {
        id: admin._id || admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      };

      console.log('👤 Admin user created:', adminUser);

      // Test localStorage availability first
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        const testValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        console.log('✅ localStorage test:', testValue === 'test' ? 'ACCESSIBLE' : 'ERREUR');
      } catch (storageError) {
        console.error('❌ localStorage BLOQUÉ:', storageError);
        setError('Votre navigateur bloque le localStorage. Vérifiez vos paramètres de confidentialité ou désactivez le mode navigation privée.');
        setLoading(false);
        return;
      }

      // Store in localStorage
      try {
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('token', token);
        
        // Verify it was saved
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        console.log('💾 Saved to localStorage - Vérification:');
        console.log('  User:', savedUser ? '✓ Sauvegardé' : '✗ ÉCHEC');
        console.log('  Token:', savedToken ? '✓ Sauvegardé' : '✗ ÉCHEC');
        
        if (!savedUser || !savedToken) {
          console.error('❌ localStorage n\'a pas persisté les données!');
          setError('Impossible de sauvegarder la session. Vérifiez les paramètres de votre navigateur.');
          setLoading(false);
          return;
        }
      } catch (storageError) {
        console.error('❌ Erreur lors de la sauvegarde dans localStorage:', storageError);
        setError('Impossible de sauvegarder la session. Votre navigateur bloque le stockage local.');
        setLoading(false);
        return;
      }

      // Set token for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // IMPORTANT: Update AuthContext state
      console.log('🔍 About to update AuthContext with setUser:', typeof authContext.setUser);
      if (authContext.setUser) {
        authContext.setUser(adminUser);
        console.log('✅ AuthContext updated with admin user');
      } else {
        console.error('❌ setUser is not available in AuthContext!');
      }

      console.log('🚀 Redirecting to /admin...');
      console.log('📍 Current URL:', window.location.href);
      console.log('📍 Target URL: /admin');

      // Force immediate redirect
      window.location.href = '/admin';
    } catch (err: unknown) {
      console.error('❌ Admin login error:', err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
            <p className="text-gray-600">Sign in to your admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Security info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            This area is reserved for authorized administrators.
            <br />
            All connections are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
