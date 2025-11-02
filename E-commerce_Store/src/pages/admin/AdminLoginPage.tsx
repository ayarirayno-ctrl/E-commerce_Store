import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt:', { email, password });

    // MODE DEMO : Connexion admin directe sans backend
    if (email.trim() === 'ayarirayen539@gmail.com' && password.trim() === 'admin123') {
      console.log('✅ Demo credentials matched!');
      
      // Créer un utilisateur admin en mode démo
      const demoAdmin = {
        id: 'demo-admin-1',
        email: 'ayarirayen539@gmail.com',
        firstName: 'Rayen',
        lastName: 'Ayari',
        role: 'admin',
        token: 'demo-token-' + Date.now(),
        isEmailVerified: true
      };
      
      console.log('👤 Demo admin created:', demoAdmin);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('user', JSON.stringify(demoAdmin));
      localStorage.setItem('token', demoAdmin.token);
      
      console.log('💾 Saved to localStorage');
      
      // Petit délai pour simuler la connexion
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('🚀 Redirecting to /admin...');
      
      // Rediriger vers le dashboard admin
      window.location.href = '/admin';
      return;
    }

    console.log('❌ Not demo credentials, trying API login...');

    // Connexion normale via API (seulement si ce n'est pas le compte démo)
    try {
      const user = await login(email, password);
      
      // Check if user is admin
      if (user.role !== 'admin') {
        setError('Access denied. This page is reserved for administrators.');
        setLoading(false);
        return;
      }

      // Automatic redirect to admin dashboard
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      // Errors are already handled by AuthContext with notification
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      console.log('❌ Login error:', error);
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
