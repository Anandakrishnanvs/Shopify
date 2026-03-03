import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products as allProducts } from '../data/products';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const FilterContent = ({
  filters,
  setFilters,
  allBrands,
}) => {
  
  const handlePriceChange = (e) => {
    setFilters((prev) => ({ ...prev, price: Number(e.target.value) }));
  };
  
  const handleBrandChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      brands: checked
        ? [...prev.brands, name]
        : prev.brands.filter((b) => b !== name),
    }));
  };
  
  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  return (
    <>
      <div>
        <h4 className="font-semibold mb-2">Price</h4>
        <input type="range" min="0" max="25000" value={filters.price} onChange={handlePriceChange} className="w-full" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹0</span>
          <span>₹{filters.price}</span>
          <span>₹{filters.price === 25000 ? '25000+' : filters.price}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Brand</h4>
        <div className="max-h-48 overflow-y-auto">
          {allBrands.map(brand => (
            <div key={brand} className="flex items-center mb-1">
              <input type="checkbox" id={`brand-${brand}`} name={brand} checked={filters.brands.includes(brand)} onChange={handleBrandChange} className="mr-2" />
              <label htmlFor={`brand-${brand}`} className="text-sm">{brand}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Customer Ratings</h4>
        {[4, 3, 2, 1].map(r => (
            <button key={r} onClick={() => handleRatingChange(r)} className={`text-sm w-full text-left p-1 rounded ${filters.rating === r ? 'bg-blue-100 font-bold' : ''}`}>
                {r}★ & above
            </button>
        ))}
        <button onClick={() => handleRatingChange(0)} className={`text-sm w-full text-left p-1 rounded mt-1 ${filters.rating === 0 ? 'bg-blue-100 font-bold' : ''}`}>
            Any
        </button>
      </div>
    </>
  );
};

const ProductListPage = () => {
  const { category } = useParams();
  const query = useQuery();
  const searchQuery = query.get('search');

  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const allBrands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], []);

  const [filters, setFilters] = useState({
    price: 25000,
    brands: [],
    rating: 0,
  });
  const [sort, setSort] = useState('popularity');

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (searchQuery) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    filtered = filtered.filter(p => p.price <= filters.price);
    
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }
    
    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    switch (sort) {
        case 'price_asc':
            return filtered.sort((a,b) => a.price - b.price);
        case 'price_desc':
            return filtered.sort((a,b) => b.price - a.price);
        case 'rating':
            return filtered.sort((a,b) => b.rating - a.rating);
        case 'newest':
             // Since we don't have a date, we can simulate by sorting by id
            return filtered.sort((a,b) => b.id - a.id);
        case 'popularity':
        default:
            return filtered.sort((a,b) => b.reviewCount - a.reviewCount);
    }

  }, [category, searchQuery, filters, sort]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white p-4 rounded-lg shadow-md w-full sticky top-28">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Filters</h3>
            <FilterContent filters={filters} setFilters={setFilters} allBrands={allBrands} />
          </div>
        </aside>
        
        <main className="w-full md:w-3/4 lg:w-4/5">
          {/* Mobile Filter Button & Header */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{category ? `${category}'s Clothing` : 'All Products'}</h1>
                {searchQuery && <p className="text-sm text-gray-600">Showing results for: "{searchQuery}"</p>}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {(filters.brands.length > 0 || filters.rating > 0 || filters.price < 250) && (
                    <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {filters.brands.length + (filters.rating > 0 ? 1 : 0) + (filters.price < 250 ? 1 : 0)}
                    </span>
                  )}
                </button>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded p-2 flex-1 sm:flex-none">
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">No products found</h2>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 shadow-xl md:hidden overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <h3 className="text-lg font-bold">Filters</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterContent filters={filters} setFilters={setFilters} allBrands={allBrands} />
              <div className="mt-6 pt-4 border-t">
                <button 
                  onClick={() => {
                    setFilters({ price: 250, brands: [], rating: 0 });
                  }}
                  className="w-full py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full mt-2 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListPage;