import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut, Heart, Moon, Sun, Bell } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LoyaltyBadge } from '../loyalty/LoyaltyBadge';
import { VoiceSearchButton } from '../common/VoiceSearchButton';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems, totalPrice, toggleCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { searchProducts } = useProducts();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
      navigate('/');
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setSearchQuery(transcript);
    if (transcript.trim()) {
      searchProducts(transcript);
      navigate('/');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 mr-12">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">E-Commerce</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex max-w-md mx-6">
            <form onSubmit={handleSearch} className="w-full flex items-center space-x-2" role="search" aria-label="Search products">
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="pr-12"
                  aria-label="Search for products"
                />
                {/* Bouton Vocal à droite dans le champ */}
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  <VoiceSearchButton onVoiceResult={handleVoiceResult} />
                </div>
              </div>
              {/* Bouton Search bleu séparé à droite */}
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                ariaLabel="Submit search query"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            {isAuthenticated && user ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  ariaLabel="User account menu"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:ml-2">{user.name}</span>
                </Button>
                {showUserMenu && (
                  <nav 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    aria-label="User account options"
                  >
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-primary-600 hover:bg-gray-100 font-medium"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 inline mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 inline mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ShoppingCart className="h-4 w-4 inline mr-2" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </nav>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:ml-2">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="relative"
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              ariaLabel={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="hidden sm:ml-2">
                {theme === 'light' ? 'Dark' : 'Light'}
              </span>
            </Button>

            {/* Loyalty Badge */}
            {isAuthenticated && <LoyaltyBadge />}

            {/* Notifications (Admin only) */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/notifications">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  ariaLabel={`Notifications, ${unreadCount} unread`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="hidden sm:ml-2">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                ariaLabel={`Wishlist, ${wishlistCount} items`}
              >
                <Heart className="h-5 w-5" />
                <span className="hidden sm:ml-2">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCartOpen}
              className="relative"
              ariaLabel={`Shopping cart, ${totalItems} items, total ${formatPrice(totalPrice)}`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:ml-2">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              ariaLabel={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4 px-2">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                className="pr-12"
              />
              {/* Bouton Vocal à droite dans le champ - Version Mobile */}
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <VoiceSearchButton onVoiceResult={handleVoiceResult} />
              </div>
            </div>
            {/* Bouton Search bleu séparé à droite - Mobile */}
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4" id="mobile-menu">
            <nav className="flex flex-col space-x" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Cart Summary (when cart has items) */}
      {totalItems > 0 && (
        <div className="bg-primary-50 border-t border-primary-200 py-2">
          <div className="container-custom">
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-700">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
              </span>
              <span className="font-semibold text-primary-900">
                Total: {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;






