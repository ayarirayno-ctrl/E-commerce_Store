import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import { KeyRound, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

interface ForgotPasswordClientPageProps {
  userType?: 'client' | 'admin';
}

const ForgotPasswordClientPage: React.FC<ForgotPasswordClientPageProps> = ({ userType = 'client' }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isAdmin = userType === 'admin';
  const apiBase = isAdmin ? '/api/admin/auth' : '/api/client-auth';

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`${apiBase}/forgot-password`, { email });
      
      if (response.data.success) {
        setStep('code');
      } else {
        setError(response.data.message || 'Erreur lors de l\'envoi du code');
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const minLength = isAdmin ? 8 : 6;
    if (newPassword.length < minLength) {
      setError(`Le mot de passe doit contenir au moins ${minLength} caractères`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`${apiBase}/reset-password`, {
        email,
        code,
        newPassword,
      });

      if (response.data.success) {
        setStep('success');
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate(isAdmin ? '/admin/login' : '/auth');
        }, 3000);
      } else {
        setError(response.data.message || 'Code invalide ou expiré');
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Code invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(isAdmin ? '/admin/login' : '/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <KeyRound className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 'success' ? 'Succès !' : 'Réinitialisation'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'email' && 'Entrez votre email pour recevoir un code'}
              {step === 'code' && 'Entrez le code reçu par email'}
              {step === 'success' && 'Votre mot de passe a été réinitialisé'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="votre-email@exemple.com"
                required
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le code'}
              </Button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </button>
            </form>
          )}

          {/* Step 2: Code & New Password */}
          {step === 'code' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
                </p>
              </div>

              <Input
                label="Code de réinitialisation"
                type="text"
                name="code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                placeholder="123456"
                maxLength={6}
                required
              />

              <PasswordInput
                label="Nouveau mot de passe"
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                placeholder={`Minimum ${isAdmin ? 8 : 6} caractères`}
                required
              />

              <PasswordInput
                label="Confirmer le mot de passe"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="Confirmer le mot de passe"
                required
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Changer l&apos;email
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mot de passe réinitialisé !
                </h3>
                <p className="text-gray-600">
                  Vous allez être redirigé vers la page de connexion...
                </p>
              </div>

              <Button
                onClick={handleBackToLogin}
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordClientPage;
