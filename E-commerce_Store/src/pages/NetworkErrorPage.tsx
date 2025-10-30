import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useEffect, useState } from 'react';

/**
 * Network Error Page
 * Displayed when there's no internet connection or API is unreachable
 */
const NetworkErrorPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Network Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              isOnline
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isOnline ? '🟢 Connecté' : '🔴 Hors ligne'}
          </span>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Problème de connexion
        </h1>
        <p className="text-gray-600 mb-8">
          {isOnline
            ? 'Le serveur est temporairement indisponible. Veuillez réessayer dans quelques instants.'
            : 'Vérifiez votre connexion Internet et réessayez.'}
        </p>

        {/* Troubleshooting Tips */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">
            Suggestions de dépannage :
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Vérifiez votre connexion Wi-Fi ou données mobiles
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Désactivez le mode avion si activé
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Essayez de recharger la page
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Vérifiez les paramètres de votre pare-feu
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={handleRefresh}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Réessayer
          </Button>
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        {/* Auto-retry indicator */}
        {!isOnline && (
          <p className="mt-6 text-sm text-gray-500">
            La page se rechargera automatiquement une fois la connexion rétablie
          </p>
        )}
      </div>
    </div>
  );
};

export default NetworkErrorPage;
