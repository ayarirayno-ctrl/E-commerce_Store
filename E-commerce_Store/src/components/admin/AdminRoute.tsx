import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  // Vérifier si l'utilisateur a un token admin valide
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  if (!adminToken || !adminUser) {
    // Si pas de token admin, rediriger vers la page de connexion admin
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const admin = JSON.parse(adminUser);
    
    // Vérifier que l'utilisateur a le rôle admin
    if (admin.role !== 'admin') {
      return <Navigate to="/admin/login" replace />;
    }

    // Si tout est OK, afficher le composant enfant
    return <>{children}</>;
  } catch (error) {
    // Si erreur lors du parsing du JSON, rediriger vers login
    console.error('Erreur lors de la vérification du token admin:', error);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminRoute;