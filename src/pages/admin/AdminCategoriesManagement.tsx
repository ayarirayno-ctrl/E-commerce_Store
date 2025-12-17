import { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Save,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: {
    _id: string;
    name: string;
  };
  image?: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function AdminCategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    imageUrl: '',
    isActive: true,
    order: 0
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    loadCategories();
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || data || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      description: '',
      parent: '',
      imageUrl: '',
      isActive: true,
      order: 0
    });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent: category.parent?._id || '',
      imageUrl: category.image?.url || '',
      isActive: category.isActive,
      order: category.order
    });
    setErrors({});
    setShowModal(true);
  };

  const openViewModal = (category: Category) => {
    setModalMode('view');
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const token = localStorage.getItem('adminToken');
      const url = modalMode === 'create' 
        ? 'http://localhost:5000/api/categories'
        : `http://localhost:5000/api/categories/${selectedCategory?._id}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const dataToSend: any = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        order: Number(formData.order)
      };

      if (formData.parent) {
        dataToSend.parent = formData.parent;
      }

      if (formData.imageUrl) {
        dataToSend.image = {
          url: formData.imageUrl,
          public_id: `category_${Date.now()}`
        };
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setShowModal(false);
        loadCategories();
        alert(modalMode === 'create' ? 'Catégorie créée avec succès!' : 'Catégorie mise à jour avec succès!');
      } else {
        const error = await response.json();
        setErrors(error.errors || { general: error.error || 'Une erreur est survenue' });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setErrors({ general: 'Erreur de connexion au serveur' });
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadCategories();
        alert('Catégorie supprimée avec succès!');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const filteredCategories = categories.filter(cat => 
    searchTerm === '' || 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Organize categories by parent/child
  const parentCategories = filteredCategories.filter(cat => !cat.parent);
  const childCategories = filteredCategories.filter(cat => cat.parent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1">Organiser et gérer les catégories de produits</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parentCategories.map((category) => {
          const children = childCategories.filter(child => child.parent?._id === category._id);
          
          return (
            <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Category Image */}
              {category.image?.url ? (
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <FolderTree className="h-16 w-16 text-white opacity-50" />
                </div>
              )}

              {/* Category Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                {/* Sub-categories */}
                {children.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Sous-catégories ({children.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {children.slice(0, 3).map(child => (
                        <span key={child._id} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          {child.name}
                        </span>
                      ))}
                      {children.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{children.length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openViewModal(category)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Voir"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Modifier"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FolderTree className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Aucune catégorie trouvée</p>
          <p className="text-gray-400 text-sm mt-2">Commencez par créer votre première catégorie</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' && 'Créer une nouvelle catégorie'}
                {modalMode === 'edit' && 'Modifier la catégorie'}
                {modalMode === 'view' && 'Détails de la catégorie'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalMode === 'view' && selectedCategory ? (
                // View Mode
                <div className="space-y-4">
                  {selectedCategory.image?.url && (
                    <img
                      src={selectedCategory.image.url}
                      alt={selectedCategory.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCategory.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Slug: {selectedCategory.slug}</p>
                    {selectedCategory.description && (
                      <p className="text-gray-600 mt-2">{selectedCategory.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCategory.parent && (
                      <div>
                        <span className="text-sm text-gray-500">Catégorie parente:</span>
                        <p className="font-semibold flex items-center gap-1">
                          <ArrowRight className="h-4 w-4" />
                          {selectedCategory.parent.name}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Ordre:</span>
                      <p className="font-semibold">{selectedCategory.order}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Statut:</span>
                      <p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          selectedCategory.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedCategory.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-red-800">{errors.general}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la catégorie *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie parente
                    </label>
                    <select
                      value={formData.parent}
                      onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Aucune (Catégorie principale)</option>
                      {categories
                        .filter(cat => !cat.parent && cat._id !== selectedCategory?._id)
                        .map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de l'image
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Catégorie active
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Save className="h-5 w-5" />
                      {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
