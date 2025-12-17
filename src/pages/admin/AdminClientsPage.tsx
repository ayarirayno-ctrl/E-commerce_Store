import React, { useEffect, useState } from 'react';
import { Search, Eye, Mail, Phone, MapPin, ShoppingBag, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  isBlocked: boolean;
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  lastLogin?: string;
}

const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [blockedClients, setBlockedClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchBlockedClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setClients(data.users || []);
      } else {
        console.error('Erreur:', data.message);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedClients = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/users?blocked=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setBlockedClients(data.clients || []);
      } else {
        console.error('Erreur:', data.message);
      }
    } catch (error) {
      console.error('Error fetching blocked clients:', error);
    }
  };

  const toggleBlockClient = async (clientId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/clients/${clientId}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !currentStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchClients();
        fetchBlockedClients(); // Refresh blocked clients list
        if (selectedClient?._id === clientId) {
          setSelectedClient({ ...selectedClient, isBlocked: !currentStatus });
        }
      }
    } catch (error) {
      console.error('Error toggling client block:', error);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm));
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && !client.isBlocked) ||
      (statusFilter === 'blocked' && client.isBlocked);
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => !c.isBlocked).length,
    blocked: clients.filter(c => c.isBlocked).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des clients...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-600 mt-1">{clients.length} client(s) inscrit(s)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'all'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('active')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'active'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clients Actifs</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('blocked')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'blocked'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clients Bloqués</p>
              <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
            </div>
            <Ban className="w-8 h-8 text-red-400" />
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commandes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total dépensé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {client.firstName[0]}{client.lastName[0]}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {client.firstName} {client.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  {client.lastLogin && (
                    <div className="text-xs text-gray-500">
                      Dernière connexion: {new Date(client.lastLogin).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {client.totalOrders || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    ${(client.totalSpent || 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    client.isBlocked
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {client.isBlocked ? 'Bloqué' : 'Actif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setIsDetailModalOpen(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Voir
                  </button>
                  <button
                    onClick={() => toggleBlockClient(client._id, client.isBlocked)}
                    className={`${
                      client.isBlocked
                        ? 'text-green-600 hover:text-green-900'
                        : 'text-red-600 hover:text-red-900'
                    }`}
                  >
                    {client.isBlocked ? (
                      <>
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Débloquer
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4 inline mr-1" />
                        Bloquer
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun client trouvé</p>
          </div>
        )}
      </div>

      {/* Blocked Clients Section */}
      {blockedClients.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Clients Bloqués ({blockedClients.length})
            </h2>
          </div>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-red-200">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Date blocage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-red-200">
                {blockedClients.map((client) => (
                  <tr key={client._id} className="hover:bg-red-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-700 font-semibold">
                            {client.firstName[0]}{client.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ShoppingBag className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {client.totalOrders || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Voir
                      </button>
                      <button
                        onClick={() => toggleBlockClient(client._id, client.isBlocked)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Débloquer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Information importante</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Les clients bloqués ne peuvent pas se connecter à leur compte. Ils recevront le message : 
                  <span className="font-semibold"> &ldquo;You are blocked from admin device. Please contact support.&rdquo;</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Client: ${selectedClient?.firstName} ${selectedClient?.lastName}`}
      >
        {selectedClient && (
          <ClientDetail
            client={selectedClient}
            onToggleBlock={() => toggleBlockClient(selectedClient._id, selectedClient.isBlocked)}
          />
        )}
      </Modal>
    </div>
  );
};

// Client Detail Component
interface ClientDetailProps {
  client: Client;
  onToggleBlock: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ client, onToggleBlock }) => {
  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            client.isBlocked
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {client.isBlocked ? 'Compte Bloqué' : 'Compte Actif'}
          </span>
          <button
            onClick={onToggleBlock}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              client.isBlocked
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {client.isBlocked ? 'Débloquer le compte' : 'Bloquer le compte'}
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations de contact</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{client.email}</p>
            </div>
          </div>
          {client.phone && (
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Téléphone</p>
                <p className="text-sm font-medium text-gray-900">{client.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Addresses */}
      {client.addresses && client.addresses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Adresses</h3>
          <div className="space-y-3">
            {client.addresses.map((address, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        Adresse {index + 1}
                      </p>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistiques</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Commandes</p>
            <p className="text-2xl font-bold text-gray-900">{client.totalOrders || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Dépensé</p>
            <p className="text-2xl font-bold text-gray-900">${(client.totalSpent || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du compte</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Inscription:</span>
            <span className="font-medium text-gray-900">
              {new Date(client.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          {client.lastLogin && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dernière connexion:</span>
              <span className="font-medium text-gray-900">
                {new Date(client.lastLogin).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientsPage;
