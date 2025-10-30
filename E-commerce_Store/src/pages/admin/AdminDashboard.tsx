import React, { useEffect, useState, useCallback } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign,
  Star
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

interface RevenueDataPoint {
  day: string;
  revenue: number;
  orders: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
}

interface Category {
  _id: string;
  name: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);

  const generateMockRevenueData = (): RevenueDataPoint[] => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return days.map((day) => ({
      day,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 50) + 10,
    }));
  };

  const fetchAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      // Fetch orders stats
      const statsResponse = await fetch('http://localhost:5000/api/orders/stats/overview', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }

      // Generate mock revenue data for last 7 days
      const mockRevenueData = generateMockRevenueData();
      setRevenueData(mockRevenueData);

      // Fetch categories for pie chart
      const categoriesResponse = await fetch('http://localhost:5000/api/categories');
      if (categoriesResponse.ok) {
        const catData = await categoriesResponse.json();
        const categoryStats = catData.categories.slice(0, 5).map((cat: Category) => ({
          name: cat.name,
          value: Math.floor(Math.random() * 100) + 20, // Mock data
        }));
        setCategoryData(categoryStats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement du dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Commandes',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'En attente',
      value: stats?.pendingOrders || 0,
      icon: Package,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Livrées',
      value: stats?.deliveredOrders || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Revenu Total',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
  ];

  const orderStatusData = [
    { name: 'En attente', value: stats?.pendingOrders || 0, color: '#EAB308' },
    { name: 'En cours', value: stats?.processingOrders || 0, color: '#3B82F6' },
    { name: 'Expédiée', value: stats?.shippedOrders || 0, color: '#8B5CF6' },
    { name: 'Livrée', value: stats?.deliveredOrders || 0, color: '#10B981' },
    { name: 'Annulée', value: stats?.cancelledOrders || 0, color: '#EF4444' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/prop-types
  const renderPieLabel = (props: any): string => {
    // eslint-disable-next-line react/prop-types
    const { name, percent } = props;
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Vue d&apos;ensemble de votre e-commerce</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenus des 7 derniers jours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Revenu ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Commandes par jour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#3B82F6" name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statut des commandes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ventes par catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" name="Ventes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            État des Commandes
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">En traitement</span>
              <span className="font-semibold">{stats?.processingOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expédiées</span>
              <span className="font-semibold">{stats?.shippedOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Annulées</span>
              <span className="font-semibold text-red-600">{stats?.cancelledOrders || 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/products"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <Package className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium">Produits</span>
            </a>
            <a
              href="/admin/orders"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium">Commandes</span>
            </a>
            <a
              href="/admin/clients"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium">Clients</span>
            </a>
            <a
              href="/admin/categories"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium">Catégories</span>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nouvelles commandes</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats?.pendingOrders || 0}</p>
          <p className="text-sm text-gray-500 mt-2">À traiter</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Clients actifs</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">--</p>
          <p className="text-sm text-gray-500 mt-2">Ce mois-ci</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Avis en attente</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">--</p>
          <p className="text-sm text-gray-500 mt-2">À modérer</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
