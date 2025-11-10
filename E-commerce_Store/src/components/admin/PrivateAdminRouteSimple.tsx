import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface PrivateAdminRouteSimpleProps {
  children: React.ReactNode;
}

export default function PrivateAdminRouteSimple({ children }: PrivateAdminRouteSimpleProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier l'authentification admin
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    console.log('🔒 Admin auth check:', { hasToken: !!adminToken, hasUser: !!adminUser });
    
    if (adminToken && adminUser) {
      try {
        const user = JSON.parse(adminUser);
        console.log('👤 Admin user:', user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Error parsing admin user:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Chargement en cours
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si pas connecté, rediriger vers login admin
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }

  // Si admin authentifié, afficher le contenu
  console.log('✅ Admin authenticated, showing content');
  return <>{children}</>;
}