import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * Generic Error Page (500)
 * Displayed for unexpected server errors
 */
const ErrorPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oups ! Une erreur s'est produite
        </h1>
        <p className="text-gray-600 mb-8">
          Nous rencontrons actuellement des difficultés techniques. 
          Veuillez réessayer dans quelques instants.
        </p>

        {/* Error Code */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <p className="text-sm text-gray-500">Code d'erreur</p>
          <p className="text-lg font-mono text-gray-900">500 - Internal Server Error</p>
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

        {/* Support Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si le problème persiste, contactez notre{' '}
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-700">
              support technique
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
