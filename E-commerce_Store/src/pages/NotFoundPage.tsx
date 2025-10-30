import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

/**
 * 404 Not Found Page
 * Displayed when user navigates to a non-existent route
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Page précédente
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Pages populaires :</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/products" className="text-indigo-600 hover:text-indigo-700">
              Produits
            </Link>
            <Link to="/categories" className="text-indigo-600 hover:text-indigo-700">
              Catégories
            </Link>
            <Link to="/about" className="text-indigo-600 hover:text-indigo-700">
              À propos
            </Link>
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-700">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
