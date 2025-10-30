import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Folder, FolderOpen } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  parentCategory?: {
    _id: string;
    name: string;
  };
  icon?: string;
  isActive: boolean;
  productsCount?: number;
}

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate parent and child categories
  const parentCategories = filteredCategories.filter(cat => !cat.parentCategory);
  const childCategories = filteredCategories.filter(cat => cat.parentCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des catégories...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-600 mt-1">
            {parentCategories.length} catégorie(s) principale(s) · {childCategories.length} sous-catégorie(s)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher par nom ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parent Categories */}
        {parentCategories.map((category) => {
          const subCategories = childCategories.filter(
            child => child.parentCategory?._id === category._id
          );

          return (
            <div key={category._id} className="bg-white rounded-lg shadow p-6">
              {/* Parent Category Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    {category.icon ? (
                      <span className="text-2xl">{category.icon}</span>
                    ) : (
                      <Folder className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                      {category.productsCount !== undefined && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {category.productsCount} produit(s)
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setIsModalOpen(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 p-2"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-900 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-categories */}
              {subCategories.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Sous-catégories ({subCategories.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {subCategories.map((subCat) => (
                      <div
                        key={subCat._id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {subCat.icon && <span className="text-lg">{subCat.icon}</span>}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{subCat.name}</p>
                            <p className="text-xs text-gray-500">{subCat.slug}</p>
                          </div>
                          {subCat.productsCount !== undefined && (
                            <span className="text-xs bg-white px-2 py-1 rounded ml-auto mr-2">
                              {subCat.productsCount} produit(s)
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            subCat.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subCat.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => {
                              setEditingCategory(subCat);
                              setIsModalOpen(true);
                            }}
                            className="text-primary-600 hover:text-primary-900 p-1"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(subCat._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Orphaned child categories (no parent) */}
        {childCategories.filter(child => !parentCategories.find(p => p._id === child.parentCategory?._id)).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">
              Sous-catégories orphelines
            </h3>
            <p className="text-sm text-yellow-700 mb-4">
              Ces sous-catégories ont une catégorie parente qui n&apos;existe plus.
            </p>
            <div className="space-y-2">
              {childCategories
                .filter(child => !parentCategories.find(p => p._id === child.parentCategory?._id))
                .map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between bg-white rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setIsModalOpen(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 p-1"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucune catégorie trouvée</p>
        </div>
      )}

      {/* Category Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
      >
        <CategoryForm
          category={editingCategory}
          parentCategories={parentCategories}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCategories();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// Category Form Component
interface CategoryFormProps {
  category: Category | null;
  parentCategories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, parentCategories, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    slug: category?.slug || '',
    parentCategory: category?.parentCategory?._id || '',
    icon: category?.icon || '',
    isActive: category?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = category
        ? `http://localhost:5000/api/categories/${category._id}`
        : 'http://localhost:5000/api/categories';
      
      const method = category ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        parentCategory: formData.parentCategory || undefined,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la catégorie
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug (URL)
        </label>
        <Input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          placeholder="ex: electronics, sports-et-loisirs"
        />
        <p className="text-xs text-gray-500 mt-1">
          Généré automatiquement depuis le nom. Utilisé dans l&apos;URL.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie parente (optionnel)
        </label>
        <select
          value={formData.parentCategory}
          onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Aucune (Catégorie principale)</option>
          {parentCategories.map((parent) => (
            <option key={parent._id} value={parent._id}>
              {parent.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icône (emoji ou texte)
        </label>
        <Input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="📱 🏃 📚 ..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Utilisez un emoji ou laissez vide pour l&apos;icône par défaut.
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
          Catégorie active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Enregistrement...' : category ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default AdminCategoriesPage;
