import React from 'react';
import { Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClearCachePage: React.FC = () => {
  const navigate = useNavigate();
  const [cleared, setCleared] = React.useState(false);

  const handleClearCache = () => {
    // Nettoyer localStorage
    localStorage.clear();
    
    // Nettoyer sessionStorage
    sessionStorage.clear();
    
    // Nettoyer les cookies
    document.cookie.split(";").forEach(c => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    setCleared(true);
    
    // Rediriger vers l'accueil après 2 secondes
    setTimeout(() => {
      navigate('/');
      // window.location.reload() SUPPRIMÉ
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        {!cleared ? (
          <>
            <Trash2 className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Nettoyer le Cache</h1>
            <p className="text-gray-600 mb-6">
              Cette action supprimera toutes les données en cache, y compris les fausses données fictives.
            </p>
            <button
              onClick={handleClearCache}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Nettoyer maintenant
            </button>
          </>
        ) : (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-900 mb-4">Cache Nettoyé ✅</h1>
            <p className="text-gray-600 mb-4">
              Toutes les données en cache ont été supprimées avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Redirection en cours...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ClearCachePage;
