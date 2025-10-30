import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Tag, Calendar, TrendingUp, Percent, DollarSign } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

interface Promotion {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  active: boolean;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
}

const AdminPromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [stats, setStats] = useState({ active: 0, expired: 0, inactive: 0, total: 0 });

  useEffect(() => {
    fetchPromotions();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = statusFilter === 'all' 
        ? 'http://localhost:5000/api/promotions'
        : `http://localhost:5000/api/promotions?status=${statusFilter}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPromotions(data.promotions || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/promotions/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/promotions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchPromotions();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();
  const isActive = (promo: Promotion) => 
    promo.active && new Date(promo.startDate) <= new Date() && new Date(promo.endDate) >= new Date();

  const filteredPromotions = promotions.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des promotions...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600 mt-1">{promotions.length} promotion(s) au total</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingPromotion(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer une promotion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'all' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('active')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'active' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Actives</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('expired')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'expired' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expirées</p>
              <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <Calendar className="w-8 h-8 text-red-400" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('inactive')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'inactive' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inactives</p>
              <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher par code promo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promo) => (
          <div key={promo._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isActive(promo) ? 'bg-green-100' : isExpired(promo.endDate) ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {promo.discountType === 'percentage' ? (
                    <Percent className={`w-6 h-6 ${
                      isActive(promo) ? 'text-green-600' : isExpired(promo.endDate) ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  ) : (
                    <DollarSign className={`w-6 h-6 ${
                      isActive(promo) ? 'text-green-600' : isExpired(promo.endDate) ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{promo.code}</h3>
                  <p className="text-sm text-gray-500">
                    {promo.discountType === 'percentage' ? `${promo.discount}% OFF` : `$${promo.discount} OFF`}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isActive(promo) ? 'bg-green-100 text-green-800' :
                isExpired(promo.endDate) ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {isActive(promo) ? 'Active' : isExpired(promo.endDate) ? 'Expirée' : 'Inactive'}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {new Date(promo.startDate).toLocaleDateString('fr-FR')} - {new Date(promo.endDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              {promo.minPurchase && (
                <p className="text-sm text-gray-600">Achat min: ${promo.minPurchase}</p>
              )}
              {promo.maxDiscount && promo.discountType === 'percentage' && (
                <p className="text-sm text-gray-600">Réduction max: ${promo.maxDiscount}</p>
              )}
              {promo.usageLimit && (
                <p className="text-sm text-gray-600">
                  Utilisations: {promo.usedCount}/{promo.usageLimit}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => {
                  setEditingPromotion(promo);
                  setIsModalOpen(true);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 inline mr-1" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(promo._id)}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucune promotion trouvée</p>
        </div>
      )}

      {/* Promotion Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromotion ? 'Modifier la promotion' : 'Créer une promotion'}
      >
        <PromotionForm
          promotion={editingPromotion}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPromotions();
            fetchStats();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// Promotion Form Component
interface PromotionFormProps {
  promotion: Promotion | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ promotion, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    code: promotion?.code || '',
    discount: promotion?.discount || 0,
    discountType: promotion?.discountType || 'percentage',
    startDate: promotion?.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
    endDate: promotion?.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
    active: promotion?.active ?? true,
    minPurchase: promotion?.minPurchase || '',
    maxDiscount: promotion?.maxDiscount || '',
    usageLimit: promotion?.usageLimit || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = promotion
        ? `http://localhost:5000/api/promotions/${promotion._id}`
        : 'http://localhost:5000/api/promotions';
      
      const method = promotion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          minPurchase: formData.minPurchase || undefined,
          maxDiscount: formData.maxDiscount || undefined,
          usageLimit: formData.usageLimit || undefined,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code Promo
        </label>
        <Input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="SUMMER2025"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de réduction
          </label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="percentage">Pourcentage (%)</option>
            <option value="fixed">Montant fixe ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {formData.discountType === 'percentage' ? 'Pourcentage (%)' : 'Montant ($)'}
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de début
          </label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin
          </label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Achat minimum (optionnel)
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.minPurchase}
            onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
            placeholder="0.00"
          />
        </div>

        {formData.discountType === 'percentage' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Réduction max (optionnel)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.maxDiscount}
              onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              placeholder="0.00"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Limite d&apos;utilisation (optionnel)
        </label>
        <Input
          type="number"
          value={formData.usageLimit}
          onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
          placeholder="Illimité"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="active" className="ml-2 text-sm text-gray-700">
          Promotion active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Enregistrement...' : promotion ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default AdminPromotionsPage;
