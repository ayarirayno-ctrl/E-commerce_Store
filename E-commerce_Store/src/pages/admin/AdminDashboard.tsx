import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign
} from 'lucide-react';

interface RealStats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<RealStats>({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  const loadRealStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            users: data.users,
            products: data.products,
            orders: data.orders,
            revenue: data.revenue
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement du dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Produits',
      value: stats.products,
      icon: Package,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Commandes',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Chiffre d&apos;Affaires',
      value: `€${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Statistiques réelles de votre e-commerce</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Données en temps réel</h3>
            <p className="text-blue-700">
              Ces statistiques sont mises à jour automatiquement et reflètent l&apos;état actuel de votre base de données.
            </p>
          </div>
        </div>
      </div>

      {/* Database Status */}
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">État de la Base de Données</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Utilisateurs enregistrés</span>
              <span className="font-semibold text-blue-600">{stats.users}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Produits disponibles</span>
              <span className="font-semibold text-green-600">{stats.products}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Commandes passées</span>
              <span className="font-semibold text-yellow-600">{stats.orders}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Revenus générés</span>
              <span className="font-semibold text-purple-600">€{stats.revenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <Package className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <span className="text-sm font-medium">Gérer les Produits</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
          >
            <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <span className="text-sm font-medium">Gérer les Commandes</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/users'}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <span className="text-sm font-medium">Gérer les Utilisateurs</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
