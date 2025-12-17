import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
  Menu,
  X,
  RefreshCw,
  User,
  UserCheck,
  UserPlus,
  Download,
  Mail,
  DollarSign
} from 'lucide-react';
import AdminProductsManagement from './admin/AdminProductsManagement';
import AdminClientsManagement from './admin/AdminClientsManagement';

interface Stats {
  orders: number;
  products: number;
  users: number;
  revenue: number;
  loading: boolean;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState<{id: string, name: string, email: string, role: string} | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0,
    loading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification admin
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
      // Charger les statistiques réelles
      loadRealStats();
    } catch (error) {
      console.error('Erreur parsing admin user:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const loadRealStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const [productsRes, statsRes, usersRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/admin/stats', { headers }),
        fetch('http://localhost:5000/api/admin/users', { headers }),
        fetch('http://localhost:5000/api/orders/admin/all', { headers })
      ]);

      let productsCount = 0;
      let usersCount = 0;
      let usersList = [];
      let ordersList = [];
      let ordersCount = 0;
      let totalRevenue = 0;

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        productsCount = productsData.total || productsData.products?.length || 0;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        usersCount = statsData.users || 0;
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        usersList = usersData.users || [];
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        ordersList = ordersData.orders || [];
        ordersCount = ordersList.length;
        totalRevenue = ordersList.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      }

      setUsers(usersList);
      setOrders(ordersList);
      setStats({
        orders: ordersCount,
        products: productsCount,
        users: usersCount,
        revenue: totalRevenue,
        loading: false
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert(`Utilisateur ${userName} supprimé avec succès`);
        // Recharger la liste
        loadRealStats();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEditUser = (user: any) => {
    console.log('🔧 Editing user:', user);
    setEditingUser(user.id);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleSaveUser = async () => {
    console.log('💾 Saving user:', editingUser, editForm);
    if (!editingUser) return;
    
    if (!editForm.name || !editForm.email) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success:', data);
        alert(`✅ ${editForm.name} a été mis à jour avec succès`);
        setEditingUser(null);
        setEditForm({ name: '', email: '' });
        // Recharger les utilisateurs
        loadRealStats();
      } else {
        const error = await response.json();
        console.error('❌ Error:', error);
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de la mise à jour: ' + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commandes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.loading ? '...' : stats.orders}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produits</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.loading ? '...' : stats.products}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.loading ? '...' : stats.users}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{stats.loading ? '...' : stats.revenue.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'products':
        return <AdminProductsManagement />;
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Commandes</h2>
            
            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Liste des commandes</h3>
                  <button 
                    onClick={loadRealStats}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualiser
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Chargement des commandes...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-lg">Aucune commande pour le moment</p>
                          <p className="text-gray-400 text-sm mt-2">Les commandes apparaîtront ici une fois créées par les clients</p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order: any) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{order._id.substring(0, 8)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.user?.firstName || 'Client'} {order.user?.lastName || ''}
                            </div>
                            <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString('fr-FR')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              ${order.total?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-sm text-gray-500">{order.items?.length || 0} article(s)</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status === 'pending' ? 'En attente' :
                               order.status === 'processing' ? 'En cours' :
                               order.status === 'shipped' ? 'Expédié' :
                               order.status === 'delivered' ? 'Livré' :
                               order.status === 'cancelled' ? 'Annulé' : order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {/* TODO: Voir détails */}}
                              className="text-purple-600 hover:text-purple-900 mr-3"
                            >
                              Voir
                            </button>
                            <button
                              onClick={() => {/* TODO: Changer statut */}}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Statut
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <AdminClientsManagement />;
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 mr-4 transition"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-red-600 hover:text-red-900 transition"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-6 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    {users.length === 0 ? (
                      <span>Aucun utilisateur inscrit pour le moment</span>
                    ) : (
                      <>
                        Affichage de <span className="font-medium">1</span> à <span className="font-medium">{Math.min(itemsPerPage, users.length)}</span> sur <span className="font-medium">{users.length}</span> résultats
                      </>
                    )}
                  </div>
                  {users.length > itemsPerPage && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Précédent
                      </button>
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                        {currentPage}
                      </button>
                      <button 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage * itemsPerPage >= users.length}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Rapports</h2>
            
            {/* Métriques réelles basées sur les données actuelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Revenus Totaux</p>
                    <p className="text-3xl font-bold">€{stats.loading ? '...' : stats.revenue.toLocaleString()}</p>
                    <p className="text-green-100 text-sm mt-1">Données réelles</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-100 text-sm">Aucune commande pour l&apos;instant</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Commandes</p>
                    <p className="text-3xl font-bold">{stats.loading ? '...' : stats.orders}</p>
                    <p className="text-blue-100 text-sm mt-1">Données réelles</p>
                  </div>
                  <ShoppingCart className="h-12 w-12 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-blue-100 text-sm">En attente de premières commandes</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Produits</p>
                    <p className="text-3xl font-bold">{stats.loading ? '...' : stats.products}</p>
                    <p className="text-purple-100 text-sm mt-1">Catalogue actuel</p>
                  </div>
                  <Package className="h-12 w-12 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-purple-100 text-sm">Produits en ligne</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Utilisateurs</p>
                    <p className="text-3xl font-bold">{stats.loading ? '...' : stats.users}</p>
                    <p className="text-orange-100 text-sm mt-1">Inscrits réels</p>
                  </div>
                  <Users className="h-12 w-12 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-orange-100 text-sm">Comptes créés</span>
                </div>
              </div>
            </div>

            {/* Message d'information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">📊 Données Analytics Réelles</h3>
              <p className="text-blue-700 mb-4">
                Cette section affiche vos véritables données e-commerce. Contrairement aux données fictives précédentes, 
                ces chiffres reflètent l&apos;état actuel de votre boutique.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-blue-800">Données en temps réel</p>
                    <p className="text-sm text-blue-700">Les statistiques se mettent à jour automatiquement avec l&apos;activité de votre boutique.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-green-800">Prêt pour le lancement</p>
                    <p className="text-sm text-green-700">Votre plateforme est configurée et prête à accueillir vos premiers clients.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de rafraîchissement */}
            <div className="flex justify-center">
              <button 
                onClick={loadRealStats}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={stats.loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${stats.loading ? 'animate-spin' : ''}`} />
                {stats.loading ? 'Chargement...' : 'Actualiser les données'}
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">Paramètres système en cours de développement...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">E-commerce Store</p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Interface Administrateur</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                <p className="text-xs text-gray-600">{adminUser.email}</p>
              </div>
              <div className="bg-blue-600 p-2 rounded-full">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © 2025 E-commerce Store - Interface Administrateur
            </p>
            <button
              onClick={() => window.open('/', '_blank')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Voir le site public →
            </button>
          </div>
        </footer>
      </div>

      {/* Modal de modification utilisateur */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Modifier l'utilisateur</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'utilisateur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email de l'utilisateur"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;