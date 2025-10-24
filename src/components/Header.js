import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, User, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartSidebar from '../components/CartSidebar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Harshee's <span className="text-pink-600">Fashion</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-900 hover:text-pink-600 transition-colors">Home</Link>
              <Link to="/shop" className="text-gray-700 hover:text-pink-600 transition-colors">Shop</Link>
              <Link to="/about" className="text-gray-700 hover:text-pink-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-700 hover:text-pink-600 cursor-pointer transition-colors" />
              
              <Heart className="h-5 w-5 text-gray-700 hover:text-pink-600 cursor-pointer transition-colors" />
              
              <button 
                onClick={handleCartToggle}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-gray-700 hover:text-pink-600" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar.url || user.avatar} 
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-700" />
                    )}
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm"
                >
                  Login
                </Link>
              )}

              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <Link to="/" className="block px-3 py-2 text-gray-900 hover:text-pink-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/shop" className="block px-3 py-2 text-gray-700 hover:text-pink-600" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-pink-600" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-pink-600" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                {!user && (
                  <Link to="/login" className="block px-3 py-2 text-pink-600 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;