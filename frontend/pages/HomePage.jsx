import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const menProducts = products.filter(p => p.category === 'Men').sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
      const womenProducts = products.filter(p => p.category === 'Women').sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
      const kidsProducts = products.filter(p => p.category === 'Kids').sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);

      setFeaturedProducts([...menProducts, ...womenProducts, ...kidsProducts]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="container mx-auto py-4 md:py-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-6 md:mb-10 min-h-[220px] md:min-h-[320px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 md:px-12 max-w-2xl text-white py-4">
          <span className="inline-block bg-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 animate-pulse">
            New Season Arrival
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-none">
            Biggest <br /> <span className="text-yellow-400">Fashion</span> Sale
          </h1>
          <p className="text-sm md:text-lg text-gray-300 mb-6 max-w-lg leading-relaxed line-clamp-2 md:line-clamp-none">
            Discover the latest trends from top global brands with up to 70% off. Your style evolution starts here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="bg-white text-primary font-black py-2.5 px-6 rounded-full hover:bg-yellow-400 hover:text-primary transition-all duration-300 transform hover:scale-105 text-center min-w-[140px] text-sm">
              SHOP NOW
            </Link>
            <Link to="/products/Women" className="bg-transparent border-2 border-white/30 backdrop-blur-sm text-white font-bold py-2.5 px-6 rounded-full hover:bg-white/10 transition-all duration-300 text-center min-w-[140px] text-sm">
              VIEW TRENDS
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-fluid-h2 font-black text-gray-900">Shop by Category</h2>
            <div className="h-1.5 w-20 bg-primary rounded-full mt-2"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: "Men's", path: "/products/Men", img: "https://img.freepik.com/free-photo/portrait-young-handsome-bearded-man_1303-19639.jpg?semt=ais_user_personalization&w=740&q=80" },
            { name: "Women's", path: "/products/Women", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" },
            { name: "Kids", path: "/products/Kids", img: "https://woombie.com/pub/media/magefan_blog/fashion_woombie.png" }
          ].map((cat) => (
            <Link key={cat.name} to={cat.path} className="group relative rounded-2xl overflow-hidden h-64 shadow-lg">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-black text-white">{cat.name}</h3>
                <p className="text-white/70 text-sm font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Explore Collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-fluid-h2 font-black text-gray-900">
              {user ? `Selected for ${user.name.split(' ')[0]}` : 'Trending Now'}
            </h2>
            <p className="text-gray-500 mt-1">Our most popular items this week</p>
          </div>
          <Link to="/products" className="text-primary font-bold hover:underline flex items-center gap-1 group">
            View All Products <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 md:h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;