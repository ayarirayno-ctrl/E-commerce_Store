/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../ui/Loading';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Private Route Component
 * Protects routes that require authentication
 * Redirects to login page if not authenticated
 */
// eslint-disable-next-line react/prop-types
const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (loading) {
    console.log('🔄 PrivateRoute: Loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Vérification de l'authentification..." />
      </div>
    );
  }

  // Redirect to login if authentication required but user not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('🔒 PrivateRoute: Redirecting to auth - not authenticated');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to home if trying to access auth page while authenticated
  if (!requireAuth && isAuthenticated) {
    console.log('🏠 PrivateRoute: Redirecting to home - already authenticated');
    return <Navigate to="/" replace />;
  }

  console.log('✅ PrivateRoute: Rendering children');
  return <>{children}</>;
};

export default PrivateRoute;
