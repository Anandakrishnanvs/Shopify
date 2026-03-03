import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';


const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    const foundProduct = products.find(p => p.id === parseInt(id));

    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images[0]);
      setSelectedSize(foundProduct.sizes[0]);
      setSelectedColor(foundProduct.colors[0]);

      const similar = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setSimilarProducts(similar);
    }

    setLoading(false);
  }, [id]);


  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (product && selectedSize && selectedColor) {
      addToCart(product, quantity, selectedSize, selectedColor);
      toast.success('Added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.error('Please login to buy products');
      navigate('/login');
      return;
    }
    if (product && selectedSize && selectedColor) {
      addToCart(product, quantity, selectedSize, selectedColor);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-[4/5] bg-gray-200 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            </div>
            <div className="flex gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-12 w-12 bg-gray-200 rounded-lg"></div>)}
            </div>
            <div className="h-14 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The item you're looking for might have been moved or removed from our collection.</p>
          <button onClick={() => navigate('/products')} className="bg-primary text-white font-black py-4 px-8 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-primary/20">
            BROWSE ALL PRODUCTS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-6 px-2">
        <span onClick={() => navigate('/')} className="hover:text-primary cursor-pointer transition-colors">Home</span>
        <span>/</span>
        <span onClick={() => navigate(`/products/${product.category}`)} className="hover:text-primary cursor-pointer transition-colors">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 bg-white p-3 sm:p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-4">
            <img src={mainImage} alt={product.name} className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-xs font-black text-primary uppercase tracking-widest mb-2 inline-block px-2 py-1 bg-blue-50 rounded-md">
              {product.brand}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mt-2 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Rating value={product.rating} />
              </div>
              <span className="text-sm font-bold text-gray-400 border-l pl-4 border-gray-200">
                {product.reviewCount} Reviews
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl font-black text-gray-900">₹{product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through font-medium">₹{product.oldPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              {product.description}
            </p>
          </div>

          <div className="space-y-8 mb-10">
            {/* Size */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-black uppercase tracking-wider text-gray-900">Select Size</label>
                <button className="text-xs font-bold text-primary hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-12 flex items-center justify-center px-4 rounded-xl border-2 font-bold transition-all ${selectedSize === size ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-95' : 'border-gray-100 hover:border-gray-300 bg-white text-gray-600'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-gray-900 mb-4">Color</label>
              <div className="flex flex-wrap gap-4">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold transition-all ${selectedColor === color ? 'border-primary bg-blue-50 text-primary scale-95' : 'border-gray-100 hover:border-gray-300 bg-white text-gray-600'}`}
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color.toLowerCase() }}></span>
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
               <label className="text-sm font-black uppercase tracking-wider text-gray-900">Qty</label>
               <div className="flex items-center bg-gray-100 rounded-xl p-1">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors font-bold text-xl">-</button>
                 <span className="w-12 text-center font-black">{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors font-bold text-xl">+</button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              className="bg-secondary text-white font-black py-4 px-8 rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-primary text-white font-black py-4 px-8 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <section className="mt-20 px-2">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Similar Style</h2>
            <p className="text-gray-500">More items you might like from {product.category}</p>
          </div>
          <button onClick={() => navigate(`/products/${product.category}`)} className="text-primary font-black flex items-center gap-2 hover:gap-3 transition-all">
            SEE ALL <span className="text-xl">→</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {similarProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;