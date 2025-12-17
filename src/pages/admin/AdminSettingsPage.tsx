import { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Mail, 
  DollarSign, 
  Truck, 
  Globe,
  Shield,
  Bell,
  AlertCircle
} from 'lucide-react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  currency: string;
  language: string;
  timezone: string;
  
  // Email settings
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;
  
  // Payment settings
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalSecret: string;
  
  // Shipping settings
  shippingFee: number;
  freeShippingThreshold: number;
  
  // Notifications
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  newUserNotifications: boolean;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'E-commerce Store',
    siteDescription: 'Votre boutique en ligne moderne',
    siteEmail: 'contact@example.com',
    sitePhone: '+33 1 23 45 67 89',
    currency: 'EUR',
    language: 'fr',
    timezone: 'Europe/Paris',
    
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    emailFrom: '',
    
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalSecret: '',
    
    shippingFee: 5.00,
    freeShippingThreshold: 50.00,
    
    orderNotifications: true,
    lowStockAlerts: true,
    newUserNotifications: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Paiement', icon: DollarSign },
    { id: 'shipping', label: 'Livraison', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du site *
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={settings.sitePhone}
                  onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Devise
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuseau horaire
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Configurez votre serveur SMTP pour envoyer des emails transactionnels (confirmations de commande, réinitialisations de mot de passe, etc.)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hôte SMTP
                </label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  placeholder="587"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilisateur SMTP
              </label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe SMTP
              </label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email expéditeur
              </label>
              <input
                type="email"
                value={settings.emailFrom}
                onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                placeholder="noreply@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Stripe</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clé publique Stripe
                  </label>
                  <input
                    type="text"
                    value={settings.stripePublicKey}
                    onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                    placeholder="pk_test_..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clé secrète Stripe
                  </label>
                  <input
                    type="password"
                    value={settings.stripeSecretKey}
                    onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                    placeholder="sk_test_..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">PayPal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID PayPal
                  </label>
                  <input
                    type="text"
                    value={settings.paypalClientId}
                    onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secret PayPal
                  </label>
                  <input
                    type="password"
                    value={settings.paypalSecret}
                    onChange={(e) => setSettings({ ...settings, paypalSecret: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais de livraison (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.shippingFee}
                onChange={(e) => setSettings({ ...settings, shippingFee: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil de livraison gratuite (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                La livraison sera gratuite pour les commandes dépassant ce montant
              </p>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Notifications de commandes</p>
                <p className="text-sm text-gray-500">Recevoir un email pour chaque nouvelle commande</p>
              </div>
              <input
                type="checkbox"
                checked={settings.orderNotifications}
                onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Alertes de stock faible</p>
                <p className="text-sm text-gray-500">Être notifié quand un produit est en rupture de stock</p>
              </div>
              <input
                type="checkbox"
                checked={settings.lowStockAlerts}
                onChange={(e) => setSettings({ ...settings, lowStockAlerts: e.target.checked })}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Nouveaux utilisateurs</p>
                <p className="text-sm text-gray-500">Recevoir un email pour chaque nouvelle inscription</p>
              </div>
              <input
                type="checkbox"
                checked={settings.newUserNotifications}
                onChange={(e) => setSettings({ ...settings, newUserNotifications: e.target.checked })}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Fonctionnalité en développement</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Les paramètres de sécurité avancés seront disponibles dans une prochaine version.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Options de sécurité</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                  Authentification à deux facteurs
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                  Politique de mots de passe
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                  Limitation des tentatives de connexion
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                  Liste noire d'adresses IP
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-7 w-7 text-purple-600" />
          Paramètres du Site
        </h1>
        <p className="text-gray-600 mt-1">Configurer les paramètres généraux de votre boutique</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs and Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSave}>
          <div className="p-6">
            {renderTabContent()}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
