import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Image as ImageIcon, FileText, Layout, Search, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

interface Content {
  _id: string;
  type: 'banner' | 'slider' | 'page';
  title: string;
  slug?: string;
  content?: string;
  imageUrl?: string;
  images?: string[];
  link?: string;
  position: number;
  isActive: boolean;
  metadata?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  banners: number;
  sliders: number;
  pages: number;
  active: number;
  inactive: number;
}

const AdminContentPage: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    banners: 0,
    sliders: 0,
    pages: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    type: 'banner' as 'banner' | 'slider' | 'page',
    title: '',
    slug: '',
    content: '',
    imageUrl: '',
    link: '',
    position: 0,
    isActive: true,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonText: '',
    buttonLink: '',
    metaTitle: '',
    metaDescription: '',
  });

  const fetchContents = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('isActive', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`http://localhost:5000/api/content?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setContents(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, searchTerm]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/content/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchStats();
  }, [fetchContents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingContent
        ? `http://localhost:5000/api/content/${editingContent._id}`
        : 'http://localhost:5000/api/content';

      const payload: Partial<Content> = {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl,
        link: formData.link,
        position: formData.position,
        isActive: formData.isActive,
      };

      if (formData.type === 'page' && formData.slug) {
        payload.slug = formData.slug;
      }

      if (formData.metaTitle || formData.metaDescription) {
        payload.metadata = {
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
        };
      }

      if (formData.backgroundColor || formData.textColor || formData.buttonText) {
        payload.settings = {
          backgroundColor: formData.backgroundColor,
          textColor: formData.textColor,
          buttonText: formData.buttonText,
          buttonLink: formData.buttonLink,
        };
      }

      const response = await fetch(url, {
        method: editingContent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        alert(editingContent ? 'Contenu modifié !' : 'Contenu créé !');
        setShowModal(false);
        resetForm();
        fetchContents();
        fetchStats();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce contenu ?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/content/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Contenu supprimé !');
        fetchContents();
        fetchStats();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      type: content.type,
      title: content.title,
      slug: content.slug || '',
      content: content.content || '',
      imageUrl: content.imageUrl || '',
      link: content.link || '',
      position: content.position,
      isActive: content.isActive,
      backgroundColor: content.settings?.backgroundColor || '#ffffff',
      textColor: content.settings?.textColor || '#000000',
      buttonText: content.settings?.buttonText || '',
      buttonLink: content.settings?.buttonLink || '',
      metaTitle: content.metadata?.metaTitle || '',
      metaDescription: content.metadata?.metaDescription || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingContent(null);
    setFormData({
      type: 'banner',
      title: '',
      slug: '',
      content: '',
      imageUrl: '',
      link: '',
      position: 0,
      isActive: true,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonText: '',
      buttonLink: '',
      metaTitle: '',
      metaDescription: '',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return <ImageIcon className="w-4 h-4" />;
      case 'slider':
        return <Layout className="w-4 h-4" />;
      case 'page':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      banner: 'bg-purple-100 text-purple-800',
      slider: 'bg-blue-100 text-blue-800',
      page: 'bg-green-100 text-green-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion de Contenu</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau Contenu
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <div className="text-sm text-purple-600">Banners</div>
          <div className="text-2xl font-bold text-purple-800">{stats.banners}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-600">Sliders</div>
          <div className="text-2xl font-bold text-blue-800">{stats.sliders}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">Pages</div>
          <div className="text-2xl font-bold text-green-800">{stats.pages}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg shadow">
          <div className="text-sm text-emerald-600">Actifs</div>
          <div className="text-2xl font-bold text-emerald-800">{stats.active}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Inactifs</div>
          <div className="text-2xl font-bold text-gray-800">{stats.inactive}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="banner">Banners</option>
            <option value="slider">Sliders</option>
            <option value="page">Pages</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date création</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge(content.type)}`}>
                    {getTypeIcon(content.type)}
                    {content.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{content.title}</div>
                  {content.slug && <div className="text-sm text-gray-500">/{content.slug}</div>}
                </td>
                <td className="px-6 py-4 text-gray-700">{content.position}</td>
                <td className="px-6 py-4">
                  {content.isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <Eye className="w-4 h-4" />
                      Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      <EyeOff className="w-4 h-4" />
                      Inactif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(content.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(content)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(content._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingContent ? 'Modifier le contenu' : 'Nouveau contenu'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'banner' | 'slider' | 'page' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="banner">Banner</option>
                    <option value="slider">Slider</option>
                    <option value="page">Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {formData.type === 'page' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="a-propos"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lien</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="number"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Actif</span>
                    </label>
                  </div>
                </div>

                {/* Settings */}
                {(formData.type === 'banner' || formData.type === 'slider') && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Paramètres visuels</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Couleur fond</label>
                        <input
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                          className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Couleur texte</label>
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                          className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Texte bouton</label>
                        <input
                          type="text"
                          value={formData.buttonText}
                          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lien bouton</label>
                        <input
                          type="url"
                          value={formData.buttonLink}
                          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO */}
                {formData.type === 'page' && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">SEO</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                        <textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingContent ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentPage;
