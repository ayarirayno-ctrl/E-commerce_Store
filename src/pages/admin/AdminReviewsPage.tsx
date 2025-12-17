import React, { useEffect, useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Trash2, Star, MessageSquare, ShieldAlert } from 'lucide-react';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

interface Review {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    images: Array<{ url: string }>;
  };
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  isApproved: boolean;
  adminResponse?: {
    text: string;
    respondedBy: {
      name: string;
      email: string;
    };
    respondedAt: string;
  };
  createdAt: string;
}

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'reported'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    reported: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, ratingFilter]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let url = 'http://localhost:5000/api/reviews';
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/reviews/stats', {
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

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/reviews/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchMatch = 
      review.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des avis...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Avis Clients</h1>
        <p className="text-gray-600 mt-1">{reviews.length} avis au total</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'all' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'approved' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Approuvés</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'pending' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </button>

        <button
          onClick={() => setStatusFilter('reported')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            statusFilter === 'reported' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Signalés</p>
          <p className="text-2xl font-bold text-red-600">{stats.reported}</p>
        </button>

        <div className="p-4 rounded-lg border-2 border-gray-200 bg-white text-left">
          <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher par client, produit ou titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">Toutes les notes</option>
          <option value="5">5 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="2">2 étoiles</option>
          <option value="1">1 étoile</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {review.product.images?.[0] ? (
                  <img
                    src={review.product.images[0].url}
                    alt={review.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Eye className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.title}</h3>
                    <p className="text-sm text-gray-500">
                      {review.product.name} · Par {review.user.firstName} {review.user.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.isVerifiedPurchase && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        Achat vérifié
                      </span>
                    )}
                    {review.reportCount > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        {review.reportCount} signalement(s)
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.isApproved ? 'Approuvé' : 'En attente'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                {review.adminResponse && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Réponse de l&apos;équipe</p>
                        <p className="text-sm text-blue-800">{review.adminResponse.text}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setIsDetailModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Voir
                  </button>
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Approuver
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleReject(review._id)}
                      className="px-3 py-1.5 text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Rejeter
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucun avis trouvé</p>
        </div>
      )}

      {/* Review Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Détails de l'avis"
      >
        {selectedReview && (
          <ReviewDetail
            review={selectedReview}
            onApprove={() => {
              handleApprove(selectedReview._id);
              setIsDetailModalOpen(false);
            }}
            onReject={() => {
              handleReject(selectedReview._id);
              setIsDetailModalOpen(false);
            }}
            onDelete={() => {
              handleDelete(selectedReview._id);
              setIsDetailModalOpen(false);
            }}
            onResponseAdded={() => {
              fetchReviews();
              setIsDetailModalOpen(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

// Review Detail Component
interface ReviewDetailProps {
  review: Review;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onResponseAdded: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review, onApprove, onReject, onDelete, onResponseAdded }) => {
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddResponse = async () => {
    if (!responseText.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/reviews/${review._id}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: responseText }),
      });

      if (response.ok) {
        onResponseAdded();
      }
    } catch (error) {
      console.error('Error adding response:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="flex items-center gap-4 pb-4 border-b">
        {review.product.images?.[0] && (
          <img
            src={review.product.images[0].url}
            alt={review.product.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
          <p className="text-sm text-gray-500">
            Par {review.user.firstName} {review.user.lastName}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Note</h4>
        {renderStars(review.rating)}
      </div>

      {/* Review Content */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Avis</h4>
        <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
        <p className="text-gray-700">{review.comment}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Utiles</p>
          <p className="text-lg font-semibold text-gray-900">{review.helpfulCount}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Signalements</p>
          <p className="text-lg font-semibold text-red-600">{review.reportCount}</p>
        </div>
      </div>

      {/* Admin Response */}
      {review.adminResponse ? (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Votre réponse</h4>
          <p className="text-sm text-blue-800">{review.adminResponse.text}</p>
        </div>
      ) : (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Répondre à cet avis</h4>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={3}
            placeholder="Votre réponse..."
          />
          <Button
            onClick={handleAddResponse}
            disabled={loading || !responseText.trim()}
            className="mt-2"
          >
            {loading ? 'Envoi...' : 'Envoyer la réponse'}
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        {!review.isApproved && (
          <Button variant="primary" onClick={onApprove}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approuver
          </Button>
        )}
        {review.isApproved && (
          <Button variant="secondary" onClick={onReject}>
            <XCircle className="w-4 h-4 mr-2" />
            Rejeter
          </Button>
        )}
        <Button variant="secondary" onClick={onDelete} className="ml-auto">
          <Trash2 className="w-4 h-4 mr-2" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
