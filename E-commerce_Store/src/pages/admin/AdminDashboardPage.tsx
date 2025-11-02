import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: number;
  pendingOrders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real stats from API
    // Pour l'instant, utiliser des données de test
    setTimeout(() => {
      setStats({
        totalProducts: 24,
        totalOrders: 156,
        totalUsers: 89,
        totalRevenue: 45678,
        recentOrders: 12,
        pendingOrders: 5,
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      name: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      name: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-green-500',
      trend: '+23%',
    },
    {
      name: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      trend: '+8%',
    },
    {
      name: 'Revenus',
      value: `${stats.totalRevenue.toLocaleString('fr-FR')} €`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      trend: '+15%',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bienvenue sur le tableau de bord</h1>
        <p className="text-purple-100">Voici un aperçu de votre boutique en ligne</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                {card.trend}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.name}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {stats.recentOrders} nouvelles
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Vous avez {stats.recentOrders} nouvelles commandes au cours des dernières 24 heures.
          </p>
          <button className="mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm">
            Voir toutes les commandes →
          </button>
        </div>

        {/* Pending orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Commandes en attente</h2>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-gray-600 text-sm">
            {stats.pendingOrders} commandes nécessitent votre attention.
          </p>
          <button className="mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm">
            Gérer les commandes →
          </button>
        </div>
      </div>

      {/* Activity overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu de l&apos;activité</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Graphique d&apos;activité à venir...</p>
        </div>
      </div>
    </div>
  );
}
