import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const DiagnosticPage: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: localStorage disponible
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === 'test') {
        diagnostics.push({
          name: 'LocalStorage',
          status: 'success',
          message: 'LocalStorage fonctionne correctement',
          details: 'Écriture et lecture réussies'
        });
      } else {
        diagnostics.push({
          name: 'LocalStorage',
          status: 'error',
          message: 'LocalStorage ne fonctionne pas correctement',
          details: 'Impossible de lire les données écrites'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: 'LocalStorage',
        status: 'error',
        message: 'LocalStorage bloqué ou désactivé',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 2: Cookies tiers
    try {
      document.cookie = "test_cookie=1; SameSite=None; Secure";
      const hasCookie = document.cookie.includes('test_cookie');
      document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      
      diagnostics.push({
        name: 'Cookies',
        status: hasCookie ? 'success' : 'warning',
        message: hasCookie ? 'Cookies fonctionnent' : 'Cookies tiers possiblement bloqués',
        details: hasCookie ? 'Les cookies sont acceptés' : 'Chrome peut bloquer les cookies tiers'
      });
    } catch (error) {
      diagnostics.push({
        name: 'Cookies',
        status: 'error',
        message: 'Impossible de tester les cookies',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 3: Mode navigation privée
    try {
      const isPrivate = await new Promise<boolean>((resolve) => {
        const test = 'test';
        try {
          localStorage.setItem(test, '1');
          localStorage.removeItem(test);
          // Si on arrive ici, pas en mode privé
          resolve(false);
        } catch (e) {
          // Exception en mode privé
          resolve(true);
        }
      });

      diagnostics.push({
        name: 'Mode Navigation',
        status: isPrivate ? 'warning' : 'success',
        message: isPrivate ? 'Mode navigation privée détecté' : 'Mode navigation normale',
        details: isPrivate ? 'Le mode incognito limite le localStorage' : 'Pas de restriction détectée'
      });
    } catch (error) {
      diagnostics.push({
        name: 'Mode Navigation',
        status: 'warning',
        message: 'Impossible de détecter le mode',
        details: 'Test non concluant'
      });
    }

    // Test 4: Extensions du navigateur
    const extensionIndicators = [
      'webkitStorageInfo' in window,
      '__REACT_DEVTOOLS_GLOBAL_HOOK__' in window,
      'chrome' in window && 'runtime' in (window as any).chrome
    ];

    const hasExtensions = extensionIndicators.some(indicator => indicator);
    diagnostics.push({
      name: 'Extensions Navigateur',
      status: hasExtensions ? 'warning' : 'success',
      message: hasExtensions ? 'Extensions détectées' : 'Aucune extension détectée',
      details: hasExtensions ? 'Des extensions peuvent interférer avec le localStorage' : 'Pas d\'interférence détectée'
    });

    // Test 5: API Backend accessible
    try {
      const response = await fetch('http://localhost:5000/api/test');
      diagnostics.push({
        name: 'Backend API',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Backend accessible' : 'Backend inaccessible',
        details: `Status: ${response.status}`
      });
    } catch (error) {
      diagnostics.push({
        name: 'Backend API',
        status: 'error',
        message: 'Impossible de contacter le backend',
        details: error instanceof Error ? error.message : 'Erreur de connexion'
      });
    }

    // Test 6: CORS
    try {
      const response = await fetch('http://localhost:5000/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      diagnostics.push({
        name: 'CORS',
        status: 'success',
        message: 'CORS configuré correctement',
        details: 'Les requêtes cross-origin fonctionnent'
      });
    } catch (error) {
      diagnostics.push({
        name: 'CORS',
        status: 'error',
        message: 'Problème CORS détecté',
        details: error instanceof Error ? error.message : 'Erreur CORS'
      });
    }

    // Test 7: User/Token dans localStorage
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    diagnostics.push({
      name: 'Données Auth',
      status: (user && token) ? 'success' : 'warning',
      message: (user && token) ? 'User et Token présents' : 'Pas de données d\'authentification',
      details: `User: ${user ? '✓' : '✗'}, Token: ${token ? '✓' : '✗'}`
    });

    setResults(diagnostics);
    setLoading(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getRecommendations = () => {
    const hasErrors = results.some(r => r.status === 'error');
    const hasWarnings = results.some(r => r.status === 'warning');

    if (!hasErrors && !hasWarnings) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold mb-2">✅ Tout fonctionne correctement !</h3>
          <p className="text-green-700">Aucun problème détecté. Votre navigateur est configuré correctement.</p>
        </div>
      );
    }

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-semibold mb-3">⚠️ Recommandations :</h3>
        <ul className="space-y-2 text-yellow-700 text-sm">
          {results.find(r => r.name === 'LocalStorage' && r.status === 'error') && (
            <li>• <strong>LocalStorage bloqué :</strong> Vérifiez les paramètres de confidentialité de Chrome (chrome://settings/content/cookies)</li>
          )}
          {results.find(r => r.name === 'Cookies' && r.status !== 'success') && (
            <li>• <strong>Cookies tiers bloqués :</strong> Activez les cookies dans les paramètres Chrome</li>
          )}
          {results.find(r => r.name === 'Mode Navigation' && r.status === 'warning') && (
            <li>• <strong>Mode incognito détecté :</strong> Utilisez une fenêtre normale pour une meilleure compatibilité</li>
          )}
          {results.find(r => r.name === 'Extensions Navigateur' && r.status === 'warning') && (
            <li>• <strong>Extensions détectées :</strong> Désactivez temporairement AdBlock, Privacy Badger, etc.</li>
          )}
          {results.find(r => r.name === 'Backend API' && r.status === 'error') && (
            <li>• <strong>Backend inaccessible :</strong> Vérifiez que le serveur tourne sur le port 5000</li>
          )}
          {results.find(r => r.name === 'CORS' && r.status === 'error') && (
            <li>• <strong>Problème CORS :</strong> Vérifiez la configuration CORS du backend</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🔍 Diagnostic Chrome
              </h1>
              <p className="text-gray-600">
                Vérification des problèmes potentiels avec Chrome et localStorage
              </p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Relancer
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Exécution des tests de diagnostic...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(result.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {result.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.status === 'success' ? 'bg-green-100 text-green-800' :
                          result.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.status === 'success' ? 'OK' :
                           result.status === 'error' ? 'ERREUR' : 'ATTENTION'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-1">
                        {result.message}
                      </p>
                      {result.details && (
                        <p className="text-gray-500 text-xs">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {getRecommendations()}

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-blue-800 font-semibold mb-2">ℹ️ Informations navigateur :</h3>
                <div className="text-blue-700 text-sm space-y-1">
                  <p>• <strong>User Agent:</strong> {navigator.userAgent}</p>
                  <p>• <strong>Plateforme:</strong> {navigator.platform}</p>
                  <p>• <strong>Langue:</strong> {navigator.language}</p>
                  <p>• <strong>Online:</strong> {navigator.onLine ? '✓' : '✗'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
