import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { AlertTriangle, RotateCcw, Home, Settings } from 'lucide-react';

const EmergencyResetPage: React.FC = () => {
  const clearAllData = () => {
    // Vider complètement le localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Vider les cookies de session
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    alert('✅ Toutes les données ont été effacées. La page va se recharger.');
    window.location.href = '/';
  };

  const clearOnlyAuth = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('auth_state');
    
    alert('✅ Données d\'authentification effacées. Redirection...');
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Réinitialisation d&apos;Urgence
            </h1>
            <p className="text-gray-600 text-sm">
              Utilisez cette page si vous rencontrez des problèmes de connexion ou des boucles infinies
            </p>
          </div>

          {/* Current State */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">État Actuel :</h3>
            <p className="text-xs text-gray-600">
              User: {localStorage.getItem('user') ? '✅ Présent' : '❌ Absent'}<br/>
              Token: {localStorage.getItem('token') ? '✅ Présent' : '❌ Absent'}<br/>
              URL: {window.location.href}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={clearOnlyAuth}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser Authentification
            </Button>

            <Button
              onClick={clearAllData}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Réinitialisation Complète
            </Button>

            <Link to="/">
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                <Home className="h-4 w-4 mr-2" />
                Retour Accueil
              </Button>
            </Link>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">Instructions :</h3>
            <ol className="text-xs text-blue-800 space-y-1">
              <li>1. Essayez d&apos;abord &quot;Réinitialiser Authentification&quot;</li>
              <li>2. Si le problème persiste, utilisez &quot;Réinitialisation Complète&quot;</li>
              <li>3. Redémarrez les serveurs si nécessaire</li>
              <li>4. Videz le cache du navigateur (Ctrl+Shift+Del)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResetPage;