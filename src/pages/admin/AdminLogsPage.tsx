import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  Filter,
  Calendar,
  User,
  Package,
  ShoppingCart,
  Tag,
  Star,
  Users,
  FolderTree,
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';

interface AdminLog {
  _id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'other';
  adminId: {
    _id: string;
    name?: string;
    email: string;
  };
  adminEmail?: string;
  targetModel: string;
  targetId?: string;
  description: string;
  changes?: {
    field: string;
    oldValue: string | number | boolean | null;
    newValue: string | number | boolean | null;
  }[];
  ipAddress?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  last24Hours: number;
  last7Days: number;
  byAction: { _id: string; count: number }[];
  byModel: { _id: string; count: number }[];
}

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [filterDays, setFilterDays] = useState<string>('7');

  const fetchLogs = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      let url = 'http://localhost:5000/api/admin/logs';
      
      const params = new URLSearchParams();
      if (filterAction !== 'all') params.append('action', filterAction);
      if (filterModel !== 'all') params.append('targetModel', filterModel);
      
      // Filtre par date
      if (filterDays !== 'all') {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(filterDays));
        params.append('startDate', startDate.toISOString());
      }
      
      params.append('limit', '200');
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, [filterAction, filterModel, filterDays]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/admin/logs/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="w-5 h-5" />;
      case 'update': return <Edit className="w-5 h-5" />;
      case 'delete': return <Trash2 className="w-5 h-5" />;
      case 'login': return <LogIn className="w-5 h-5" />;
      case 'logout': return <LogOut className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-600';
      case 'update': return 'bg-blue-100 text-blue-600';
      case 'delete': return 'bg-red-100 text-red-600';
      case 'login': return 'bg-purple-100 text-purple-600';
      case 'logout': return 'bg-gray-100 text-gray-600';
      default: return 'bg-yellow-100 text-yellow-600';
    }
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      create: 'Création',
      update: 'Modification',
      delete: 'Suppression',
      login: 'Connexion',
      logout: 'Déconnexion',
      other: 'Autre',
    };
    return labels[action] || action;
  };

  const getModelIcon = (model: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Product: Package,
      Order: ShoppingCart,
      Category: FolderTree,
      Client: Users,
      User: User,
      Promotion: Tag,
      Review: Star,
    };
    const Icon = icons[model] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Logs d&apos;activité</h1>
        <p className="text-gray-600 mt-2">Historique des actions administratives</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total des logs</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dernières 24h</p>
              <p className="text-3xl font-bold text-green-600">{stats?.last24Hours || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Derniers 7 jours</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.last7Days || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Créations</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.byAction.find(a => a._id === 'create')?.count || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les actions</option>
              <option value="create">Création</option>
              <option value="update">Modification</option>
              <option value="delete">Suppression</option>
              <option value="login">Connexion</option>
              <option value="logout">Déconnexion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les modèles</option>
              <option value="Product">Produits</option>
              <option value="Order">Commandes</option>
              <option value="Category">Catégories</option>
              <option value="Client">Clients</option>
              <option value="Promotion">Promotions</option>
              <option value="Review">Avis</option>
              <option value="User">Utilisateurs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">Aujourd&apos;hui</option>
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">90 derniers jours</option>
              <option value="all">Tout l&apos;historique</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline des actions</h2>
        
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun log trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log._id}
                className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
              >
                {/* Timeline dot */}
                <div className={`absolute left-[-9px] top-0 p-2 rounded-full ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>

                {/* Log content */}
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getModelIcon(log.targetModel)}
                        <span className="font-medium">{log.targetModel}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatRelativeTime(log.createdAt)}</span>
                  </div>

                  <p className="text-gray-900 mb-2">{log.description}</p>

                  {log.changes && log.changes.length > 0 && (
                    <div className="mt-3 bg-white rounded border border-gray-200 p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Modifications :</p>
                      <div className="space-y-1">
                        {log.changes.map((change, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium text-gray-700">{change.field}:</span>
                            <span className="text-red-600 line-through ml-2">{JSON.stringify(change.oldValue)}</span>
                            <span className="text-green-600 ml-2">→ {JSON.stringify(change.newValue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{log.adminId?.email || log.adminEmail || 'Admin'}</span>
                    </div>
                    {log.ipAddress && (
                      <span>IP: {log.ipAddress}</span>
                    )}
                    {log.targetId && (
                      <span className="font-mono">ID: {log.targetId.slice(0, 8)}...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogsPage;
