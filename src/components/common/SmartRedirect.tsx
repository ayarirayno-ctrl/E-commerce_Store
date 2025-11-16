import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../ui/Loading';

/**
 * Smart Route Component
 * Redirects users to the appropriate page based on authentication status
 * Prevents infinite redirect loops
 */
const SmartRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      console.log('🔄 SmartRedirect: Checking auth status...', { user: user?.email, loading });
      
      if (user) {
        console.log('✅ SmartRedirect: User authenticated, redirecting to home');
        navigate('/home', { replace: true });
      } else {
        console.log('❌ SmartRedirect: No user, redirecting to auth');
        navigate('/auth', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Redirection en cours..." />
      </div>
    );
  }

  return null;
};

export default SmartRedirect;