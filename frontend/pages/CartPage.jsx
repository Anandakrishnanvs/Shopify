import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartItemRow = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 border-b border-gray-100 last:border-0">
      {/* Image and Basic Info */}
      <div className="flex items-center gap-4 w-full sm:flex-1">
        <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-grow min-w-0">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">{item.brand}</span>
          <Link to={`/product/${item.id}`} className="font-bold text-lg text-gray-900 hover:text-primary transition-colors block leading-tight mb-1">
            {item.name}
          </Link>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
             <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Size: {item.selectedSize}</span>
             <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Color: {item.selectedColor}</span>
          </div>
          <button 
            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} 
            className="text-red-500 hover:text-red-700 text-xs font-black uppercase tracking-wider mt-4 flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Item
          </button>
        </div>
      </div>

      {/* Quantity and Price */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button 
            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} 
            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold disabled:opacity-30"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} 
            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
          >
            +
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 font-bold mb-1">₹{item.price.toFixed(2)} / each</p>
          <p className="font-black text-xl text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

const CartPage = () => {
  const { cartItems, totalPrice, cartCount } = useCart();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 md:py-20 px-4 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 max-w-2xl mx-auto border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Your bag is empty!</h1>
          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Let's find some amazing styles for you.</p>
          <Link to="/products" className="inline-block bg-primary text-white font-black py-4 px-10 rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1">
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-black text-gray-900">Shopping Bag</h1>
        <span className="bg-primary text-white text-xs font-black px-2 py-1 rounded-lg">
          {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="divide-y divide-gray-50">
            {cartItems.map(item => (
              <CartItemRow key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} item={item} />
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
             <Link to="/products" className="text-primary font-black flex items-center gap-2 hover:gap-3 transition-all group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> CONTINUE SHOPPING
             </Link>
             <button className="text-gray-400 hover:text-red-500 text-sm font-bold transition-colors">Clear Shopping Bag</button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl sticky top-24 overflow-hidden relative">
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            
            <h2 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span className="font-bold">Subtotal</span>
                <span className="text-white font-black">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-bold">Shipping</span>
                <span className="text-green-400 font-black">FREE</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-bold">Estimated Tax</span>
                <span className="text-white font-black">₹0.00</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Total Amount</p>
                  <p className="text-4xl font-black text-yellow-400 mt-1">₹{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <Link to="/checkout" className="block w-full bg-secondary text-white font-black py-5 rounded-2xl hover:bg-orange-600 transition-all text-center shadow-xl shadow-orange-500/20 active:scale-95">
              PROCEED TO CHECKOUT
            </Link>
            
            <div className="mt-8 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04currM12 21.355r7.118-4.016a11.955 11.955 0 003.882-10.395M12 21.355r-7.118-4.016a11.955 11.955 0 01-3.882-10.395" />
                  </svg>
                  SECURE CHECKOUT GUARANTEED
               </div>
               <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  ALL MAJOR CARDS ACCEPTED
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;