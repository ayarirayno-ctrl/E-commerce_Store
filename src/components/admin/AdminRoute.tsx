import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../ui/Loading';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Vérification des droits d'administration..." />
      </div>
    );
  }

  // Redirect to login if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    console.log('🔒 AdminRoute: Redirecting to admin login - not admin');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('✅ AdminRoute: Rendering admin panel');
  return <>{children}</>;
};

export default AdminRoute;