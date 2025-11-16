import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User as UserIcon, Mail, Package, Settings, LogOut, ShoppingBag, MapPin, CreditCard, Save, Award } from 'lucide-react';
import { LoyaltyDashboard } from '../components/loyalty/LoyaltyDashboard';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
}

const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'profile' | 'orders' | 'loyalty' | 'settings' | null;
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'loyalty' | 'settings'>(tabParam || 'profile');
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'United States',
    },
  });

  // Mock orders data
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2025-10-25',
      total: 299.99,
      status: 'delivered',
      items: 3,
    },
    {
      id: 'ORD-002',
      date: '2025-10-28',
      total: 149.50,
      status: 'processing',
      items: 2,
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateProfile(formData);
      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || 'United States',
      },
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <UserIcon className="h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('loyalty')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'loyalty'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Award className="h-5 w-5" />
                    Rewards
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={handleCancelEdit} variant="outline">
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile} loading={saving} disabled={saving} leftIcon={<Save className="h-4 w-4" />}>
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          {isEditing ? (
                            <Input
                              label="Full Name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          ) : (
                            <>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                              </label>
                              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                {user.name}
                              </div>
                            </>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            {user.email}
                          </div>
                        </div>
                        {isEditing && (
                          <div>
                            <Input
                              label="Phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+216 94 816 735"
                            />
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Shipping Address
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Input
                                label="Street Address"
                                value={formData.address.street}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  address: { ...formData.address, street: e.target.value }
                                })}
                                placeholder="123 Main St"
                              />
                            </div>
                            <Input
                              label="City"
                              value={formData.address.city}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, city: e.target.value }
                              })}
                              placeholder="San Francisco"
                            />
                            <Input
                              label="State"
                              value={formData.address.state}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, state: e.target.value }
                              })}
                              placeholder="CA"
                            />
                            <Input
                              label="ZIP Code"
                              value={formData.address.zipCode}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, zipCode: e.target.value }
                              })}
                              placeholder="94102"
                            />
                            <Input
                              label="Country"
                              value={formData.address.country}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, country: e.target.value }
                              })}
                              placeholder="United States"
                            />
                          </div>
                        </div>
                      )}

                      {!isEditing && user.address && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Shipping Address
                          </h3>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-900">{user.address.street}</p>
                            <p className="text-gray-900">{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                            <p className="text-gray-900">{user.address.country}</p>
                          </div>
                        </div>
                      )}

                      {!isEditing && !user.address && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Shipping Address
                          </h3>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-600 text-sm">No address saved yet</p>
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Payment Methods
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-600 text-sm">No payment methods saved</p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Add Payment Method
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <ShoppingBag className="h-6 w-6" />
                      Order History
                    </h2>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{order.id}</h3>
                              <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{order.items} items</span>
                            <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loyalty Tab */}
                {activeTab === 'loyalty' && (
                  <div>
                    <LoyaltyDashboard />
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="••••••••"
                            />
                          </div>
                          <Button>Update Password</Button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
