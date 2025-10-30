import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut, Heart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems, totalPrice, toggleCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { searchProducts } = useProducts();
  const { user, isAuthenticated, logout } = useAuth();
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

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Commerce</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="pr-12"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  Search
                </Button>
              </div>
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
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:ml-2">{user.name}</span>
                </Button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
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

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="sm" className="relative">
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
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                className="pr-12"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
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






