import React, { useEffect, useState } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

interface Order {
  _id: string;
  orderNumber: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.client.firstName} ${order.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
        <p className="text-gray-600 mt-1">{orders.length} commande(s) au total</p>
      </div>

      {/* Status Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-lg border-2 transition-all ${
            statusFilter === 'all'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl font-bold text-gray-900">{stats.all}</div>
          <div className="text-sm text-gray-600">Toutes</div>
        </button>
        
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusFilter === status
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats[status as keyof typeof stats]}
              </div>
              <div className="text-sm text-gray-600">{config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher par numéro, client ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
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
                Paiement
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
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.client.firstName} {order.client.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.client.email}</div>
                    </div>
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
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : order.paymentStatus === 'refunded'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Payé' :
                       order.paymentStatus === 'failed' ? 'Échoué' :
                       order.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusConfig[order.status].color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      Voir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Commande ${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onStatusUpdate={(newStatus) => updateOrderStatus(selectedOrder._id, newStatus)}
          />
        )}
      </Modal>
    </div>
  );
};

// Order Detail Component
interface OrderDetailProps {
  order: Order;
  onStatusUpdate: (status: string) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onStatusUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Status Update */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statut de la commande
        </label>
        <select
          value={order.status}
          onChange={(e) => onStatusUpdate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="shipped">Expédiée</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      {/* Client Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Client</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm">
            <span className="font-medium">Nom:</span> {order.client.firstName} {order.client.lastName}
          </p>
          <p className="text-sm">
            <span className="font-medium">Email:</span> {order.client.email}
          </p>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Adresse de livraison</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm">{order.shippingAddress.street}</p>
          <p className="text-sm">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-sm">{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Articles</h3>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} × {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Paiement</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Méthode:</span>
            <span className="text-sm font-medium">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Statut:</span>
            <span className={`text-sm font-medium ${
              order.paymentStatus === 'paid' ? 'text-green-600' : 
              order.paymentStatus === 'failed' ? 'text-red-600' : 
              'text-yellow-600'
            }`}>
              {order.paymentStatus === 'paid' ? 'Payé' :
               order.paymentStatus === 'failed' ? 'Échoué' :
               order.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
            </span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="text-sm font-semibold">Total:</span>
            <span className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
