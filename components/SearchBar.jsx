import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { products } from '../data/products';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredSuggestions = products.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSuggestions([]);
      setIsFocused(false);
    }
  };
  
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm('');
    setSuggestions([]);
    setIsFocused(false);
  }

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="flex items-center group">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for fashion..."
            className="w-full pl-5 pr-12 py-2.5 text-sm font-medium text-gray-900 bg-white/95 backdrop-blur-sm rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all border-none shadow-inner"
          />
          <button 
            type="submit" 
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-primary p-2 rounded-full hover:bg-blue-50 transition-all active:scale-90"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl z-50 mt-2 overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
          {suggestions.map(product => (
            <li 
              key={product.id} 
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-0 border-gray-50"
              onClick={() => handleSuggestionClick(product.id)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.brand}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;