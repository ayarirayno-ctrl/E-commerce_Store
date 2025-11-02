import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../ui/Loading';

interface PrivateAdminRouteProps {
  children: React.ReactNode;
}

export default function PrivateAdminRoute({ children }: PrivateAdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Si pas connecté, rediriger vers login admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si connecté mais pas admin, rediriger vers accueil
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si admin, afficher le contenu
  return <>{children}</>;
}
