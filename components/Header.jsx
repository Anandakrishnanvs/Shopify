import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
  const { cartCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary text-white p-2 md:p-3 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="text-xl md:text-2xl font-black tracking-tight hover:text-yellow-300 transition-colors">
            SHOPIFY
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 flex-shrink-0">
          <Link to="/products/Men" className="text-sm font-semibold hover:text-yellow-300 transition-all-300">Men's</Link>
          <Link to="/products/Women" className="text-sm font-semibold hover:text-yellow-300 transition-all-300">Women's</Link>
          <Link to="/products/Kids" className="text-sm font-semibold hover:text-yellow-300 transition-all-300">Kid's</Link>
        </nav>
        
        {/* Search Bar - Hidden on very small mobile, visible on sm+ */}
        <div className="flex-1 max-w-xl hidden sm:block mx-2">
          <SearchBar />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {/* User Desktop */}
          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="flex items-center gap-2 text-sm font-medium bg-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors"
              >
                <div className="w-6 h-6 bg-yellow-400 text-primary rounded-full flex items-center justify-center text-xs font-bold uppercase">
                  {user?.name.charAt(0)}
                </div>
                <span className="hidden lg:inline">Hi, {user?.name.split(' ')[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 overflow-hidden border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Account</p>
                    <p className="text-sm text-gray-900 font-bold truncate">{user?.name}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">Your Profile</Link>
                  <Link to="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">Orders</Link>
                  <button onClick={logout} className="w-full text-left block px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors">Logout</button>
                </div>
              )}
            </div>
          ) : (
             <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <Link to="/login" className="text-sm font-bold px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-bold bg-secondary text-white px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors">Sign Up</Link>
             </div>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 hover:bg-blue-700 rounded-full transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce shadow-sm">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 hover:bg-blue-700 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search - Only on tiny mobile */}
      <div className="sm:hidden px-2 pb-2 mt-1">
        <SearchBar />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[115px] sm:top-[68px] bg-primary z-40 overflow-y-auto animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col p-6 space-y-2">
            <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-2">Shopping Categories</p>
            <Link to="/products/Men" className="text-white text-xl font-bold py-3 flex justify-between items-center border-b border-blue-800">
              Men's Fashion <span className="text-blue-400">→</span>
            </Link>
            <Link to="/products/Women" className="text-white text-xl font-bold py-3 flex justify-between items-center border-b border-blue-800">
              Women's Fashion <span className="text-blue-400">→</span>
            </Link>
            <Link to="/products/Kids" className="text-white text-xl font-bold py-3 flex justify-between items-center border-b border-blue-800">
              Kids' Collection <span className="text-blue-400">→</span>
            </Link>
            
            <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mt-8 mb-2">My Account</p>
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link to="/login" className="bg-blue-700 text-white font-bold py-3 rounded-lg text-center">Login</Link>
                <Link to="/register" className="bg-secondary text-white font-bold py-3 rounded-lg text-center">Join Now</Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/profile" className="text-white text-lg font-semibold py-2">Account Dashboard</Link>
                <Link to="/orders" className="text-white text-lg font-semibold py-2">Recent Orders</Link>
                <button onClick={logout} className="text-red-300 text-lg font-bold py-2 text-left">Sign Out</button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;